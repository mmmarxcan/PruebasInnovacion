-- Crear usuario de prueba
INSERT INTO users (email, password_hash, rol, nombre) 
VALUES ('demo@usuario.com', 'demo123', 'RESTAURANT_OWNER', 'Usuario Demo')
ON CONFLICT (email) DO NOTHING;

-- Obtener el ID del usuario demo para asignarlo como owner (opcional, dejaremos algunos sin owner y otros con)
DO $$
DECLARE
    demo_owner_id INT;
BEGIN
    SELECT id INTO demo_owner_id FROM users WHERE email = 'demo@usuario.com';

    -- Insertar 10 restaurantes
    INSERT INTO restaurantes (nombre, categoria, direccion, latitud, longitud, rating_promedio, owner_id) VALUES
    ('Paraiso Del Cafe', 'Breakfast Spot', 'Calle 27 por 54 y 56 (Numero 8-A), 97320 Progreso, Yucatán', 21.286306458612195, -89.65099418792872, NULL, demo_owner_id),
    ('Panadería María Elide', 'Bakery', '97320 Progreso, Yucatán', 21.284474360661964, -89.64965819046506, NULL, demo_owner_id),
    ('Mr. Machete', 'Burger Joint', 'Progreso de Castro, Yucatán', 21.28702178373453, -89.64821311839154, NULL, demo_owner_id),
    ('Elio Al Mare Ristorante', 'Italian Restaurant', 'Calle 21, Progreso, Yucatán', 21.289750302353177, -89.64235841130206, NULL, demo_owner_id),
    ('Pizza Pop', 'Pizzeria', 'C 68 (29 y 31), 97320 Progreso, Yucatán', 21.284107722941037, -89.65656048343696, NULL, demo_owner_id),
    ('El Haguay', 'Seafood Restaurant', 'Malecon De Progreso, 97320 Progreso, Yucatán', 21.288622, -89.653946, NULL, demo_owner_id),
    ('La Antigua Progreso', 'Seafood Restaurant', 'Calle 21 x 60, 97320 Progreso, Yucatán', 21.288295432239263, -89.65372401339754, NULL, demo_owner_id),
    ('El Pez Gordo', 'Restaurant', 'Malecón, 97320 Progreso, Yucatán', 21.288668, -89.654, NULL, demo_owner_id),
    ('Almadía', 'Seafood Restaurant', '97320 Progreso, Yucatán', 21.28851, -89.655007, NULL, demo_owner_id),
    ('Retro Burger', 'Burger Joint', 'Parque de la Paz. Calle 19 x 68 y 66. (Av malecon.), 97320 Progreso, Yucatán', 21.288514638435018, -89.65596914291382, NULL, demo_owner_id);

END $$;
