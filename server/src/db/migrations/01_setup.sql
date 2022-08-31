-- for Levenshtein distance
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

CREATE TABLE IF NOT EXISTS dna(
  id SERIAL PRIMARY KEY,
  sequence VARCHAR(255),
);
