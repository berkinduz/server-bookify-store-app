create EXTENSION if not exists "uuid-ossp";

DROP TABLE if exists products;
create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text not null,
	price integer not null
)

DROP TABLE if exists users;
create table users (
   id uuid primary key default uuid_generate_v4(),
   name text not null,
   password text not null
);

DROP TABLE if exists carts;
CREATE TYPE cartstatus AS ENUM ('OPEN', 'ORDERED');
create table carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null,
	foreign key ("user_id") references "users" ("id"),
	created_at date not null,
	updated_at date not null,
	status cartstatus
)

DROP TABLE if exists cart_items;
create table cart_items (
	cart_id uuid,
	foreign key ("cart_id") references "carts" ("id"),
	product_id uuid,
    foreign key ("product_id") references "products" ("id"),
	count integer not null default 1 
)

DROP TABLE if exists orders;
create table if not exists orders (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid,
	foreign key ("user_id") references "users" ("id"),
	cart_id uuid,
	foreign key ("cart_id") references "carts" ("id"),
	payment jsonb,
	delivery jsonb,
	comments text,
	status cartstatus default 'OPEN',
	total integer not null
);
