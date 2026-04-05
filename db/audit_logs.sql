CREATE TABLE `audit_logs` (
  `id`         CHAR(36)     NOT NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `entity`     VARCHAR(191) NOT NULL,
  `entity_id`  VARCHAR(191) NOT NULL,
  `action`     VARCHAR(191) NOT NULL,
  `actor_id`   VARCHAR(191)     NULL,
  `before`     JSON             NULL,
  `after`      JSON             NULL,

  PRIMARY KEY (`id`),
  INDEX `audit_logs_entity_entity_id_idx` (`entity`, `entity_id`),
  INDEX `audit_logs_actor_id_idx` (`actor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;