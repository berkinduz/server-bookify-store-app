insert into products (id, title, description, price) values
('a78a-4942-ba71-20551b59673', 'rasberry PI 4', 'Broadcom BCM2711, Quad core Cortex-A72 (ARM v8) 64-bit SoC @ 1.8GHz; 1GB, 2GB, 4GB or 8GB LPDDR4-3200 SDRAM (depending on model)',  10),
('4942-ba71-20551b59673', 'rasberry PI 5', 'Raspberry Pi 5 features the Broadcom BCM2712 quad-core Arm Cortex A76 processor @ 2.4GHz', 20);

insert into users (id, name, password) values
('c50094e1-a78a-4942-ba71-20551b596732', 'Tigran', 'test123'),
('c50094e1-a78a-4942-ba71-20551b596732', 'Epam', 'test456');

insert into carts (user_id, created_at, updated_at, status) values
('c50094e1-a78a-4942-ba71-20551b596732', '12-11-2023', '12-11-2023', 'ORDERED'),
('4f02b169-2173-4d55-960f-21e67c3b4e19', '12-11-2023', '12-11-2023', 'OPEN'),

insert into cart_items (cart_id, product_id, count) values
('generated_cart_id_1', 'a78a-4942-ba71-20551b59673', 1),
('generated_cart_id_2', '4942-ba71-20551b59673', 10),


