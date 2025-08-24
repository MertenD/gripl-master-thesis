create table dataset (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(255) not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table evaluation_data
    add column dataset_id bigint references dataset(id) on delete set null;