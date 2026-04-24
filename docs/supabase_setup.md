# SkillLink Supabase Setup

This project already uses Flyway migrations, so switching to Supabase is mainly a datasource/profile change.

## 1) Create a Supabase project

Create a project in Supabase and open Project Settings > Database to copy:

- Host
- Port
- Database name
- User
- Password

For Spring Boot, prefer the direct PostgreSQL endpoint on port 5432.

## 2) Configure backend environment

Use the template at backend/.env.supabase.example and set real values.

Minimum required variables:

- SPRING_PROFILES_ACTIVE=supabase
- SUPABASE_DB_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require
- SUPABASE_DB_USER=postgres.<project-ref>
- SUPABASE_DB_PASSWORD=<your password>

Recommended:

- APP_JWT_SECRET=<long random secret>

## 3) Run backend

From backend directory:

PowerShell session variables example:
$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER="postgres.<project-ref>"
$env:SUPABASE_DB_PASSWORD="<your password>"
$env:APP_JWT_SECRET="<long random secret>"
mvn spring-boot:run

## 4) Verify migrations

On first run, Flyway should apply migration files from backend/src/main/resources/db/migration.

Check Supabase SQL editor for:

- flyway_schema_history
- core tables such as users, bookings, reviews, payments, messages

## 5) Notes

- The local H2/dev flow is still available through the default profile.
- The existing local PostgreSQL profile remains available in application-postgres.yml.
- Do not commit real secrets. Keep them in deployment environment variables.
