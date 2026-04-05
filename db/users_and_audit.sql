CREATE TABLE `users` (
  `id`                    CHAR(36)      NOT NULL,
  `created_at`            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `version`               INT           NOT NULL DEFAULT 1,

  -- Identidad
  `email`                 VARCHAR(255)  NOT NULL,
  `username`              VARCHAR(100)      NULL,
  `password_hash`         VARCHAR(255)  NOT NULL,

  -- Perfil
  `first_name`            VARCHAR(100)      NULL,
  `last_name`             VARCHAR(100)      NULL,
  `avatar_url`            VARCHAR(500)      NULL,
  `locale`                VARCHAR(10)       NULL DEFAULT 'es',

  -- Estado
  `is_active`             TINYINT(1)    NOT NULL DEFAULT 1,
  `is_email_verified`     TINYINT(1)    NOT NULL DEFAULT 0,
  `email_verified_at`     DATETIME(3)       NULL,

  -- Seguridad
  `failed_login_attempts` INT           NOT NULL DEFAULT 0,
  `locked_until`          DATETIME(3)       NULL,
  `password_changed_at`   DATETIME(3)       NULL,
  `last_login_at`         DATETIME(3)       NULL,

  -- Auditoría de actor
  `created_by`            CHAR(36)          NULL,
  `updated_by`            CHAR(36)          NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_idx` (`email`),
  UNIQUE INDEX `users_username_idx` (`username`),
  INDEX `users_is_active_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Añadir a la tabla users
ALTER TABLE `users`
  ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user' AFTER `is_active`;

-- Índice opcional, útil si filtras usuarios por rol
ALTER TABLE `users`
  ADD INDEX `users_role_idx` (`role`);