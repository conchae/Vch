export function persistGet(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function persistSet(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

// If a setting is not stored locally, return a default
// If it is stored, return the stored version
// Every reassignment is stored in LocalStorage
export default new class Settings {
  get boards() {
    return persistGet("boards") || ["qresearch", "patriotsfight"];
  }

  set boards(value) {
    return persistSet("boards", value);
  }

  get qTripcode() {
    return persistGet("qTripcode") || "!A6yxsPKia.";
  }

  set qTripcode(value) {
    return persistSet("qTripcode", value);
  }

  get orderAsc() {
    return persistGet("orderAsc") || false;
  }

  set orderAsc(value) {
    return persistSet("orderAsc", value);
  }
}();
