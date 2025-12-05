const KEY_PREFIX = "moist_frog_";

export const save = async (key, value) => {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save error", e);
  }
};

export const load = async (key) => {
  try {
    const v = localStorage.getItem(KEY_PREFIX + key);
    if (!v) return null;
    return JSON.parse(v);
  } catch (e) {
    console.error("Storage load error", e);
    return null;
  }
};

export const remove = async (key) => {
  try {
    localStorage.removeItem(KEY_PREFIX + key);
  } catch (e) {
    console.error("Storage remove error", e);
  }
};
