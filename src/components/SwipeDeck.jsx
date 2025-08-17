// src/components/SwipeDeck.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import UndoToast from "./UndoToast";

const SWIPE_CONF = { offset: 120, velocity: 500 };
const UNDO_TIMEOUT_MS = 5000;

export default function SwipeDeck({ feed = [] }) {
  const dispatch = useDispatch();

  // local stack/state so we can support undo without immediately mutating global store
  const [stack, setStack] = useState(feed || []);
  const [animating, setAnimating] = useState(false);

  // pending action: { user, status, timerId }
  const pendingRef = useRef(null);

  // toast state
  const [toast, setToast] = useState(null); // { message, secondsLeft }

  // sync incoming feed -> stack when feed changes externally
  useEffect(() => {
    setStack(feed || []);
  }, [feed]);

  const clearPending = useCallback(() => {
    if (pendingRef.current) {
      clearTimeout(pendingRef.current.timerId);
      pendingRef.current = null;
    }
    setToast(null);
  }, []);

  // delayed send to backend (called if user doesn't undo)
  const scheduleBackendCall = useCallback((user, status) => {
    // set toast with countdown
    let secondsLeft = Math.round(UNDO_TIMEOUT_MS / 1000);
    setToast({ message: `${user.firstName} removed`, secondsLeft });

    // countdown interval for UI
    const interval = setInterval(() => {
      secondsLeft -= 1;
      setToast((t) => (t ? { ...t, secondsLeft } : t));
    }, 1000);

    const timerId = setTimeout(async () => {
      clearInterval(interval);
      // Call backend
      try {
        await axios.post(`${BASE_URL}/request/send/${status}/${user._id}`, {}, { withCredentials: true });
        // update global store
        dispatch(removeUserFromFeed(user._id));
      } catch (err) {
        console.error("backend call failed", err?.response || err);
        // optional: show error toast / re-add card automatically
      } finally {
        pendingRef.current = null;
        setToast(null);
      }
    }, UNDO_TIMEOUT_MS);

    // store pendingRef so Undo can cancel
    pendingRef.current = { user, status, timerId, interval };
  }, [dispatch]);

  const undoPending = useCallback(() => {
    if (!pendingRef.current) return;
    const { user, timerId, interval } = pendingRef.current;
    clearTimeout(timerId);
    clearInterval(interval);
    // re-add user to top of stack
    setStack((s) => [user, ...s]);
    pendingRef.current = null;
    setToast(null);
  }, []);

  // helper called when user swipes or buttons used
  const handleAction = useCallback((status) => {
    if (!stack || stack.length === 0) return;
    const [top, ...rest] = stack;
    // remove top from local stack immediately for snappy UI
    setStack(rest);

    // if there is already a pending action, finalize it immediately (call backend)
    if (pendingRef.current) {
      // clear previous timer but send it to backend immediately
      const prev = pendingRef.current;
      clearTimeout(prev.timerId);
      clearInterval(prev.interval);
      // send previous to backend right away
      axios.post(`${BASE_URL}/request/send/${prev.status}/${prev.user._id}`, {}, { withCredentials: true })
        .catch(err => console.error("finalize prev failed", err));
      pendingRef.current = null;
      setToast(null);
    }

    // schedule backend call for the newly removed user
    scheduleBackendCall(top, status);
  }, [stack, scheduleBackendCall]);

  // animateOut wrapper used by drag/keyboard/buttons
  const animateOut = (status) => {
    if (animating) return;
    setAnimating(true);
    // small delay to allow exit animation to show
    setTimeout(() => {
      handleAction(status);
      setAnimating(false);
    }, 260);
  };

  // keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (!stack || stack.length === 0) return;
      if (animating) return;
      if (e.key === "ArrowRight") animateOut("interested");
      if (e.key === "ArrowLeft") animateOut("ignored");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stack, animating]);

  // drag arrow state
  const dragX = useMotionValue(0);
  const rightOpacity = useTransform(dragX, [20, 120], [0, 1], { clamp: true });
  const leftOpacity = useTransform(dragX, [-120, -20], [1, 0], { clamp: true });

  // if stack empty
  if (!stack || stack.length === 0) {
    return (
      <div className="flex flex-col items-center my-16">
        <h1 className="text-xl font-semibold text-gray-500">No New Users Found</h1>
        <p className="text-sm text-gray-400 mt-2">Come back later — we'll fetch new developers for you.</p>
      </div>
    );
  }

  // top N cards for depth
  const visible = stack.slice(0, 3).reverse();

  return (
    <div className="flex flex-col items-center my-8 pb-20">
      <div className="relative w-full max-w-xl h-auto">
        <AnimatePresence initial={false}>
          {visible.map((user, idx) => {
            const position = visible.length - 1 - idx; // 0 = top
            const isTop = position === 0;
            return (
              <motion.div
                key={user._id}
                className="absolute left-0 right-0 mx-auto"
                style={{ zIndex: 10 + idx, top: position * 10 }}

                initial={{ scale: 1 - position * 0.03, y: position * 8, opacity: 1 - position * 0.05 }}
                animate={{ scale: 1 - position * 0.03, y: position * 8, opacity: 1 - position * 0.05 }}
                exit={{ x: 200 * (position + 1), opacity: 0, transition: { duration: 0.28 } }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDrag={(e, info) => {
                  // update motion value for arrow transforms (only top)
                  if (isTop) dragX.set(info.point.x - info.offset.x); // this line keeps the motion value moving; framer uses motionValue as single source
                }}
                onDragEnd={(e, info) => {
                  if (!isTop) return;
                  const offsetX = info.offset.x;
                  const velocityX = info.velocity.x;
                  if (offsetX > SWIPE_CONF.offset || velocityX > SWIPE_CONF.velocity) {
                    // right
                    animateOut("interested");
                  } else if (offsetX < -SWIPE_CONF.offset || velocityX < -SWIPE_CONF.velocity) {
                    // left
                    animateOut("ignored");
                  }
                }}
                whileDrag={isTop ? { scale: 0.995 } : {}}
              >
                <div className="mx-4 relative">
                  {/* Arrow overlays */}
                  <motion.div
                    style={{ opacity: rightOpacity }}
                    className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: rightOpacity }}
                  >
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border rounded-full px-3 py-2 shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Interested</span>
                    </div>
                  </motion.div>

                  <motion.div
                    style={{ opacity: leftOpacity }}
                    className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: leftOpacity }}
                  >
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border rounded-full px-3 py-2 shadow">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Ignore</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M4 6h16" />
                      </svg>
                    </div>
                  </motion.div>

                  {/* The card */}
                  <UserCard user={user} showActions={false} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative flex items-center gap-28 mt-100 p-6 ">
        <button
          aria-label="Pass (Ignore)"
          className="btn btn-outline btn-error flex-1 mr-2"
          onClick={() => {
            if (stack.length === 0) return;
            animateOut("ignored");
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3z" />
          </svg>
          Ignore
        </button>

        <div className="text-sm text-gray-500">Use ← / → or drag card</div>

        <button
          aria-label="Interested (Like)"
          className="btn btn-primary flex-1 ml-1"
          onClick={() => {
            if (stack.length === 0) return;
            animateOut("interested");
          }}
        >
          Interested
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>
      </div>

      {/* Undo toast */}
      {toast && (
        <UndoToast
          message={toast.message}
          secondsLeft={toast.secondsLeft}
          onUndo={() => {
            undoPending();
          }}
          onClose={() => {
            // user dismisses: finalize now (call backend immediately)
            if (!pendingRef.current) return;
            const p = pendingRef.current;
            clearTimeout(p.timerId);
            clearInterval(p.interval);
            axios.post(`${BASE_URL}/request/send/${p.status}/${p.user._id}`, {}, { withCredentials: true })
              .catch((err) => console.error("finalize onClose failed", err));
            pendingRef.current = null;
            setToast(null);
          }}
        />
      )}
    </div>
  );
}
