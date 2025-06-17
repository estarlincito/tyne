#!/usr/bin/env node
/* eslint-disable no-console */
const run = async () => {
  console.log('cli');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
