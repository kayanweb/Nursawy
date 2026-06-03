# Security Specification

## Data Invariants
1. Messages are private between sender/receiver.
2. Shift swaps, vacation requests are private to the requester and admins.
3. Users cannot modify their own role, only admins can.

## The "Dirty Dozen" Payloads (Examples)
1. Read messages of other users (Fail).
2. Create message as someone else (Fail).
3. Update someone else's vacation request (Fail).

## Test Runner (firestore.rules.test.ts)
- Should be created later when implementing the rules.
