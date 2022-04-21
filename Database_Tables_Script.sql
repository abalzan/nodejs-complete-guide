-- Products database table script
create table products
(
    id          int auto_increment,
    title       varchar(255) not null,
    price       double       not null,
    description text         null,
    imageUrl    varchar(255) not null,
    constraint products_pk
        primary key (id)
);

create unique index products_id_uindex
    on products (id);

-- Products insert script
insert into products (title, price, description, imageUrl) values ('A book', '12.99', 'An awesome book', 'product1.jpg');