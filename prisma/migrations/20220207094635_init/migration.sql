-- CreateTable
CREATE TABLE `guild` (
    `guildId` BIGINT NOT NULL AUTO_INCREMENT,
    `prefferedLocale` VARCHAR(191) NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
