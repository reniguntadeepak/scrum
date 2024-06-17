--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-06-17 11:21:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16608)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id character varying(100),
    name character varying(50),
    number character varying(20),
    status character varying(20)
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16640)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(80) NOT NULL,
    session_name character varying(50) NOT NULL,
    user_name character varying(80) NOT NULL,
    status character varying(80) NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16588)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(100) NOT NULL,
    username character varying(100),
    password character varying(100),
    email character varying(1000)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16726)
-- Name: voting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voting (
    session_id character varying(80),
    user_name character varying(50),
    vote character varying(50)
);


ALTER TABLE public.voting OWNER TO postgres;

--
-- TOC entry 4854 (class 0 OID 16608)
-- Dependencies: 216
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, name, number, status) FROM stdin;
f25fd1cc-8fe5-46f3-ba7c-404f400dc2b4	dhb	0	dnbn
f150173c-de33-4ff1-8ded-15f12e653190	sdahb	89	sahdb
fb056ba1-e2fd-443d-a02c-cd3c7fed1b2b	kjadb	9	asd
b4fe04a8-9dc8-4931-9bd4-9a5a553d57e6	ashdb	0	sajdb
605521a7-ea1e-4310-b9a8-4fad29c43cad	deepak	9034	dsf
\.


--
-- TOC entry 4855 (class 0 OID 16640)
-- Dependencies: 217
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, session_name, user_name, status, date) FROM stdin;
\.


--
-- TOC entry 4853 (class 0 OID 16588)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, email) FROM stdin;
47b3d5e9-0595-4a2a-bdeb-d02c2b9ac851	deepak	$2b$10$m/gTrbs.td8QaV.uim.OXev8t63cstTHrC61V0DwOQQljWMO.tCBe	deepak@gmail.com
\.


--
-- TOC entry 4856 (class 0 OID 16726)
-- Dependencies: 218
-- Data for Name: voting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voting (session_id, user_name, vote) FROM stdin;
\.


--
-- TOC entry 4708 (class 2606 OID 16644)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 16600)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4702 (class 2606 OID 16598)
-- Name: users users_password_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_password_key UNIQUE (password);


--
-- TOC entry 4704 (class 2606 OID 16594)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4706 (class 2606 OID 16596)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4709 (class 2606 OID 16729)
-- Name: voting voting_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting
    ADD CONSTRAINT voting_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id);


-- Completed on 2024-06-17 11:21:28

--
-- PostgreSQL database dump complete
--

