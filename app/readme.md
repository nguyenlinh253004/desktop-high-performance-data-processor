# Desktop High Performance Data Processor

A cross-platform desktop application built with Electron and Node.js
to process very large data files (GB-scale) with high performance,
worker threads, job queue, and SQLite WAL mode.

## Core Features
- Multi-GB file import
- CPU-heavy processing using Worker Threads
- Background job queue with retry
- SQLite (WAL mode) optimized for concurrency
- Memory leak safe for long-running usage