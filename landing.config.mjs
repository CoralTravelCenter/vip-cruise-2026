export default {
  schemaVersion: 2,
  template: {
    version: "2.17.0",
  },
  builder: {
    minVersion: "3.1.1",
  },
  blocks: {
    static: ["kv_vip_cruise","vip_cruise_text"],
  },
  project: {
    name: "vip-cruise-2026",
  },
  site: {
    preset: "coral",
  },
  stack: {
    script: "js",
    markup: "html",
    styles: "scss",
  },
};
