import { useMemo, useState } from "react";
import { getSchedule } from "../../services/collection-schedule/scheduleData.js";

const dayIndexes = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function findNextPickup(days) {
  const today = new Date();
  const options = days.map((day) => {
    const pickup = new Date(today);
    const distance = (dayIndexes[day] - today.getDay() + 7) % 7;
    pickup.setDate(today.getDate() + distance);
    pickup.setHours(6, 30, 0, 0);
    return pickup;
  });

  return options.sort((first, second) => first - second)[0];
}

export function useCollectionSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const nextPickup = useMemo(
    () => (schedule ? findNextPickup(schedule.days) : null),
    [schedule]
  );

  function lookupSchedule(municipality, district) {
    setSchedule(getSchedule(municipality, district));
  }

  return {
    schedule,
    nextPickup,
    remindersEnabled,
    lookupSchedule,
    setRemindersEnabled,
  };
}
