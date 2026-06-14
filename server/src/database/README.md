# Как сгенерировать первую миграцию:

## 1. Установи helper для TypeORM CLI с ts:

npm i -D typeorm-ts-node-commonjs

## 2. Добавь скрипты в package.json:

- "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts"
  // базовая команда TypeORM CLI для проекта на TypeScript
  // -d ... указывает, какой DataSource (подключение к БД + entities + путь миграций) использовать
  // сама по себе ничего не меняет, это “обертка” для следующих команд

- "migration:generate": "npm run typeorm -- migration:generate src/database/migrations/InitSchema"
  // сравнивает текущие entity с реальной схемой БД
  // генерирует файл миграции в папке src/database/migrations с именем типа TIMESTAMP-InitSchema.ts
  // миграцию только создает, но не выполняет

- "migration:run": "npm run typeorm -- migration:run"
  // применяет все еще не примененные миграции к БД
  // записывает факт применения в таблицу migrations
  // после этого схема БД изменяется физически

- "migration:revert": "npm run typeorm -- migration:revert"
  // откатывает последнюю примененную миграцию
  // использует метод down из файла миграции
  // полезно для возврата последнего изменения схемы

<!--
    Практически это цикл:

    1. поменял entity
    2. migration:generate
    3. проверил файл миграции
    4. migration:run
    5. если нужно назад -> migration:revert
-->

## 3. Сгенерируй миграцию:

npm run migration:generate

## 4. Примени миграцию:

npm run migration:run
