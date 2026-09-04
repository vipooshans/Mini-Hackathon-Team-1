import { useEffect, useMemo, useState } from "react";
import { lookupCollectionSchedule } from "../../services/collection-schedule/collectionScheduleApi.js";

const dayIndexes = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

function getCollectionTime(collectionTime) {
  const match = typeof collectionTime === "string" && collectionTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return { hours, minutes: Number(match[2]) };
}

export function findNextPickup(collectionDay, collectionTime) {
  if (!(collectionDay in dayIndexes)) return null;
  const now = new Date();
  const pickup = new Date(now);
  const distance = (dayIndexes[collectionDay] - now.getDay() + 7) % 7;
  const time = getCollectionTime(collectionTime);
  if (!time) return null;
  const { hours, minutes } = time;
  pickup.setDate(now.getDate() + distance);
  pickup.setHours(hours, minutes, 0, 0);
  if (distance === 0 && pickup <= now) pickup.setDate(pickup.getDate() + 7);
  return pickup;
}

export function useCollectionSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(
    () => {
      try {
        return localStorage.getItem("collectionReminderEnabled") === "true";
      } catch {
        return false;
      }
    }
  );

  const nextPickup = useMemo(
    () => (schedule ? findNextPickup(schedule.collectionDay, schedule.collectionTime) : null),
    [schedule]
  );

  useEffect(() => {
    try {
      localStorage.setItem("collectionReminderEnabled", String(remindersEnabled));
    } catch {
      // The reminder remains usable for this session when storage is unavailable.
    }
  }, [remindersEnabled]);

  async function lookupSchedule(location) {
    if (loading) return;
    setLoading(true);
    setError("");
    setSchedule(null);
    setHasSearched(true);
    try {
      setSchedule(await lookupCollectionSchedule(location));
    } catch (lookupError) {
      setError(
        lookupError.code === "NOT_FOUND"
          ? "No collection schedule is currently available for this area."
          : "We couldn't load the collection schedule. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetSchedule() {
    setSchedule(null);
    setError("");
    setHasSearched(false);
  }

  return { schedule, nextPickup, loading, error, hasSearched, remindersEnabled, lookupSchedule, resetSchedule, setRemindersEnabled };
}
