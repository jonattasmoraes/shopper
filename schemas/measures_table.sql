-- Script para criação da tabela measures

CREATE TABLE IF NOT EXISTS measures (
  measure_uuid UUID PRIMARY KEY,
  customer_code VARCHAR(255) NOT NULL,
  measure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  measure_type VARCHAR(10) CHECK (measure_type IN ('WATER', 'GAS')) NOT NULL,
  image_url TEXT,
  measure_value BIGINT NOT NULL,
  has_confirmed BOOLEAN DEFAULT FALSE
);
