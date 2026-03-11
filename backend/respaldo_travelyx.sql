--
-- PostgreSQL database dump
--

\restrict sYk4xhOyVqBUt9RGJ8WJGpNO39TsIEjNMF9F6A6FbcndTKetd19OX3gcIoW2dKd

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    dia_semana integer NOT NULL,
    apertura time without time zone,
    cierre time without time zone,
    cerrado boolean DEFAULT false
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_id_seq OWNER TO postgres;

--
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- Name: platillos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platillos (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    foto_url character varying(255),
    categoria character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.platillos OWNER TO postgres;

--
-- Name: platillos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platillos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platillos_id_seq OWNER TO postgres;

--
-- Name: platillos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platillos_id_seq OWNED BY public.platillos.id;


--
-- Name: restaurante_fotos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurante_fotos (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    foto_url character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.restaurante_fotos OWNER TO postgres;

--
-- Name: restaurante_fotos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurante_fotos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurante_fotos_id_seq OWNER TO postgres;

--
-- Name: restaurante_fotos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurante_fotos_id_seq OWNED BY public.restaurante_fotos.id;


--
-- Name: restaurantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurantes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    categoria character varying(50),
    direccion text,
    latitud double precision,
    longitud double precision,
    rating_promedio numeric(2,1) DEFAULT 5.0,
    nivel_precio character varying(10),
    telefono character varying(50),
    website character varying(255),
    foto_portada character varying(255),
    estado character varying(20) DEFAULT 'pending'::character varying,
    owner_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    manual_cerrado boolean DEFAULT false,
    ambiente character varying(50),
    CONSTRAINT restaurantes_estado_check CHECK (((estado)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'blocked'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.restaurantes OWNER TO postgres;

--
-- Name: restaurantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurantes_id_seq OWNER TO postgres;

--
-- Name: restaurantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurantes_id_seq OWNED BY public.restaurantes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(30) NOT NULL,
    nombre character varying(100),
    restaurant_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_rol_check CHECK (((rol)::text = ANY ((ARRAY['SUPER_ADMIN'::character varying, 'RESTAURANT_OWNER'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- Name: platillos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platillos ALTER COLUMN id SET DEFAULT nextval('public.platillos_id_seq'::regclass);


--
-- Name: restaurante_fotos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurante_fotos ALTER COLUMN id SET DEFAULT nextval('public.restaurante_fotos_id_seq'::regclass);


--
-- Name: restaurantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurantes ALTER COLUMN id SET DEFAULT nextval('public.restaurantes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (id, restaurant_id, dia_semana, apertura, cierre, cerrado) FROM stdin;
\.


--
-- Data for Name: platillos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platillos (id, restaurant_id, nombre, descripcion, precio, foto_url, categoria, created_at) FROM stdin;
\.


--
-- Data for Name: restaurante_fotos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurante_fotos (id, restaurant_id, foto_url, created_at) FROM stdin;
\.


--
-- Data for Name: restaurantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurantes (id, nombre, categoria, direccion, latitud, longitud, rating_promedio, nivel_precio, telefono, website, foto_portada, estado, owner_id, created_at, manual_cerrado, ambiente) FROM stdin;
6	Paraiso Del Cafe	Café	Calle 27 por 54 y 56 (Numero 8-A), 97320 Progreso, Yucatán	21.286306	-89.650994	5.0	$	\N	\N	\N	active	\N	2026-03-08 15:51:26.054424	f	familyfriendly
7	Panadería María Elide	Panadería	97320 Progreso, Yucatán	21.284474	-89.649658	5.0	$	\N	\N	\N	active	\N	2026-03-08 15:51:26.055829	f	familyfriendly
8	Mr. Machete	Hamburguesas	Progreso de Castro, Yucatán	21.287021	-89.648213	5.0	$	\N	\N	\N	active	\N	2026-03-08 15:51:26.056366	f	casual
9	Elio Al Mare Ristorante	Italiana	Calle 21, Progreso, Yucatán	21.28975	-89.642358	5.0	$$$	\N	\N	\N	active	\N	2026-03-08 15:51:26.056994	f	formal
10	Pizza Pop	Pizzería	C 68 (29 y 31), 97320 Progreso, Yucatán	21.284107	-89.65656	5.0	$$	\N	\N	\N	active	\N	2026-03-08 15:51:26.057596	f	casual
11	El Haguay	Mariscos	Malecon De Progreso, 97320 Progreso, Yucatán	21.288622	-89.653946	5.0	$$	\N	\N	\N	active	\N	2026-03-08 15:51:26.058077	f	casual
12	La Antigua Progreso	Mariscos	Calle 21 x 60, 97320 Progreso, Yucatán	21.288295	-89.653724	5.0	$$	\N	\N	\N	active	\N	2026-03-08 15:51:26.058567	f	familyfriendly
13	Almadía	Mariscos	97320 Progreso, Yucatán	21.28851	-89.655007	5.0	$$$	\N	\N	\N	active	\N	2026-03-08 15:51:26.059065	f	formal
15	Sol y Mar	Mexicana	Calle 27, 97320 Progreso, Yucatán	21.286363	-89.662287	5.0	$$	\N	\N	\N	inactive	\N	2026-03-08 15:51:26.06036	f	casual
14	Retro Burger	Hamburguesas	Parque de la Paz. Calle 19 x 68 y 66. (Av malecon.), 97320 Progreso, Yucatán	21.288514	-89.655969	5.0	$	\N	\N	\N	inactive	\N	2026-03-08 15:51:26.059863	f	casual
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, rol, nombre, restaurant_id, created_at) FROM stdin;
1	super@admin.com	admin123	SUPER_ADMIN	Super Admin	\N	2026-03-07 20:27:54.558895
45	testuser@gmail.com	password123	RESTAURANT_OWNER	Test User	\N	2026-03-07 22:19:39.770364
46	nadie@gmail.com	123456789a	RESTAURANT_OWNER	Brayan Padilla	\N	2026-03-11 09:51:00.874926
\.


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_id_seq', 1, false);


--
-- Name: platillos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platillos_id_seq', 1, true);


--
-- Name: restaurante_fotos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurante_fotos_id_seq', 1, false);


--
-- Name: restaurantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurantes_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 46, true);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- Name: platillos platillos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platillos
    ADD CONSTRAINT platillos_pkey PRIMARY KEY (id);


--
-- Name: restaurante_fotos restaurante_fotos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurante_fotos
    ADD CONSTRAINT restaurante_fotos_pkey PRIMARY KEY (id);


--
-- Name: restaurantes restaurantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurantes
    ADD CONSTRAINT restaurantes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users fk_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES public.restaurantes(id) ON DELETE SET NULL;


--
-- Name: restaurante_fotos fk_restaurant_foto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurante_fotos
    ADD CONSTRAINT fk_restaurant_foto FOREIGN KEY (restaurant_id) REFERENCES public.restaurantes(id) ON DELETE CASCADE;


--
-- Name: horarios fk_restaurant_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_restaurant_horario FOREIGN KEY (restaurant_id) REFERENCES public.restaurantes(id) ON DELETE CASCADE;


--
-- Name: platillos fk_restaurant_platillo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platillos
    ADD CONSTRAINT fk_restaurant_platillo FOREIGN KEY (restaurant_id) REFERENCES public.restaurantes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict sYk4xhOyVqBUt9RGJ8WJGpNO39TsIEjNMF9F6A6FbcndTKetd19OX3gcIoW2dKd

