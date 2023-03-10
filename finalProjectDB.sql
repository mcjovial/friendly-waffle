PGDMP     8    2                x           finalDB    12.1    12.1 ;    ]           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ^           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            _           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            `           1262    41765    finalDB    DATABASE     ?   CREATE DATABASE "finalDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE "finalDB";
                postgres    false            ?            1255    41766 "   add_book_to_lib(character varying)    FUNCTION     ?   CREATE FUNCTION public.add_book_to_lib(input_isbn character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$

BEGIN

  

   INSERT INTO books VALUES ((SELECT MAX(bid)+1 FROM books),input_isbn);

END; $$;
 D   DROP FUNCTION public.add_book_to_lib(input_isbn character varying);
       public          postgres    false            ?            1255    41767    cal_late_fee(date, date)    FUNCTION       CREATE FUNCTION public.cal_late_fee(check_in_date date, check_out_date date) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
       IF(check_in_date-check_out_date)<=21 THEN RETURN 0;
       ELSE RETURN (check_in_date-check_out_date-21)*0.1;
    END IF;
END; $$;
 L   DROP FUNCTION public.cal_late_fee(check_in_date date, check_out_date date);
       public          postgres    false            ?            1255    41768    check_can_deletebookisbn()    FUNCTION     I  CREATE FUNCTION public.check_can_deletebookisbn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (SELECT COUNT(*) FROM books_status_view WHERE 
isbn=OLD.isbn AND status<>'IN')>=1
THEN RAISE unique_violation USING DETAIL= 'One or more book(s) with this ISBN is currently ON HOLD or CHECKOUT';
END IF;
RETURN OLD;
END
$$;
 1   DROP FUNCTION public.check_can_deletebookisbn();
       public          postgres    false            ?            1255    41769    check_can_deletespecificbook()    FUNCTION     3  CREATE FUNCTION public.check_can_deletespecificbook() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (SELECT COUNT(*) FROM books_status_view 
WHERE bid=OLD.bid AND status<>'IN')>=1
THEN RAISE unique_violation USING  DETAIL= 'This book is currently ON HOLD or CHECKOUT';
END IF;
RETURN OLD;
END
$$;
 5   DROP FUNCTION public.check_can_deletespecificbook();
       public          postgres    false            ?            1255    41770    check_checkout()    FUNCTION       CREATE FUNCTION public.check_checkout() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.bid IN (SELECT bid FROM books_status_view WHERE status='OUT'))
	THEN RAISE unique_violation USING DETAIL= 'This book not available';
END IF;
RETURN NEW;
END
$$;
 '   DROP FUNCTION public.check_checkout();
       public          postgres    false            ?            1255    41771    check_hold_ava()    FUNCTION     ?  CREATE FUNCTION public.check_hold_ava() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE holds
SET available_on = NOW(), bid= (SELECT 
	books_status_view.bid 
	FROM holds JOIN books_status_view ON holds.isbn= 
		 books_status_view.isbn 
	WHERE format='Physical' AND status='IN' AND 
		 username=NEW.username AND holds.isbn=NEW.isbn LIMIT 1)
	WHERE (SELECT COUNT(*) 
		   FROM (SELECT * FROM holds JOIN books_status_view ON 
	holds.isbn=books_status_view.isbn 
		   WHERE format='Physical' AND status='IN' AND 
	username=NEW.username AND holds.isbn=NEW.isbn)
		   AS book)>=1 AND username=NEW.username AND holds.isbn=NEW.isbn;
RETURN NEW;
END
$$;
 '   DROP FUNCTION public.check_hold_ava();
       public          postgres    false            ?            1255    41772    checkallholds()    FUNCTION     ?  CREATE FUNCTION public.checkallholds() RETURNS TABLE(b_username character varying, b_isbn character, b_title character varying, b_author character varying, b_format text, b_request_on timestamp without time zone, b_available_on timestamp without time zone, b_bid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
	
	  DELETE FROM holds WHERE (CURRENT_DATE - DATE(available_on))>3;
	
	  RETURN QUERY SELECT username, isbn,title, author, 
			  CASE WHEN format='A' THEN 'AudioBook' 
				  WHEN format='E' THEN 'EBook' 
				  WHEN format='P' THEN 'Physical' 
			  END AS format, 
			  request_on, available_on, bid 
	  FROM holds NATURAL JOIN bookinfo 
	  ORDER BY request_on;
END; $$;
 &   DROP FUNCTION public.checkallholds();
       public          postgres    false            ?            1255    41773    checkmyhold(character varying)    FUNCTION     ?  CREATE FUNCTION public.checkmyhold(input_username character varying) RETURNS TABLE(b_isbn character, b_title character varying, b_author character varying, b_format text, b_request_on timestamp without time zone, b_available_on timestamp without time zone, b_bid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
	
	  DELETE FROM holds WHERE (CURRENT_DATE - DATE(available_on))>3 AND username=input_username;
	
	  RETURN QUERY SELECT isbn,title, author, 
			  CASE WHEN format='A' THEN 'AudioBook' 
				  WHEN format='E' THEN 'EBook' 
				  WHEN format='P' THEN 'Physical' 
			  END AS format, 
			  request_on, available_on, bid 
	  FROM holds NATURAL JOIN bookinfo 
	  WHERE username =input_username
	  ORDER BY request_on;
END; $$;
 D   DROP FUNCTION public.checkmyhold(input_username character varying);
       public          postgres    false            ?            1255    41774 .   checkout_hold_book(integer, character varying)    FUNCTION     '  CREATE FUNCTION public.checkout_hold_book(input_bid integer, input_username character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO checkout VALUES (input_bid,input_username,DEFAULT,NULL);
	
	DELETE FROM holds WHERE username=input_username AND bid=input_bid;

END; $$;
 ^   DROP FUNCTION public.checkout_hold_book(input_bid integer, input_username character varying);
       public          postgres    false            ?            1255    41775 -   checkout_physical(integer, character varying)    FUNCTION     ?  CREATE FUNCTION public.checkout_physical(input_bid integer, input_cid character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF(SELECT issued_date FROM cards WHERE cid =input_cid)= 
		(SELECT MAX(issued_date) FROM cards WHERE username=(SELECT username FROM cards WHERE cid=input_cid))	
		THEN 
		BEGIN 
			IF (SELECT COUNT (*) FROM books_status_view WHERE status='ON HOLD' AND bid=input_bid AND format='Physical')=1 THEN
				RAISE unique_violation USING DETAIL= 'This book is not available';
			ELSIF (SELECT COUNT (*) FROM books_status_view WHERE bid=input_bid AND (format='AudioBook' OR format='EBook'))=1 THEN
				RAISE unique_violation USING DETAIL= 'This book is an online book.';
			ELSE
				INSERT INTO checkout VALUES (input_bid, (SELECT username FROM cards NATURAL JOIN patrons WHERE cid=input_cid));
			END IF;
		END;
	ELSE 
		RAISE unique_violation USING DETAIL= 'CID does not exist';
    END IF;
END; $$;
 X   DROP FUNCTION public.checkout_physical(input_bid integer, input_cid character varying);
       public          postgres    false            ?            1255    41776 "   countnotavabook(character varying)    FUNCTION     ?  CREATE FUNCTION public.countnotavabook(check_isbn character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT COUNT(*) FROM books_status_view 
		WHERE (status = 'OUT' OR status = 'ON HOLD') AND isbn=check_isbn) IS NULL
       		THEN RETURN 0;
    ELSE RETURN (SELECT COUNT(*) FROM books_status_view 
		    WHERE (status = 'OUT' OR status = 'ON HOLD') AND isbn=check_isbn);
	END IF;
END; $$;
 D   DROP FUNCTION public.countnotavabook(check_isbn character varying);
       public          postgres    false            ?            1255    41777 -   lib_checkout_hold(integer, character varying)    FUNCTION     !  CREATE FUNCTION public.lib_checkout_hold(input_bid integer, input_username character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
     IF((SELECT COUNT(*) FROM holds WHERE bid=input_bid AND 
username=input_username)=1 ) AND ((SELECT COUNT(*) FROM cards WHERE username=input_username)>=1)
	  THEN 
	  BEGIN 
	     DELETE FROM holds WHERE bid=input_bid AND username=input_username;
			INSERT INTO checkout VALUES (input_bid, input_username);
	     END ;
	ELSIF (SELECT COUNT(*) FROM cards WHERE username=input_username)<1 THEN
		RAISE unique_violation USING DETAIL= 'This patron does not have a library card';
	ELSIF (SELECT COUNT(*) FROM holds WHERE bid=input_bid AND username=input_username)<1 THEN
		RAISE unique_violation USING DETAIL= 'This hold does not exist';
    END IF;
END; $$;
 ]   DROP FUNCTION public.lib_checkout_hold(input_bid integer, input_username character varying);
       public          postgres    false            ?            1255    41778 G   login(character varying, character varying, integer, character varying)    FUNCTION     ?  CREATE FUNCTION public.login(usertype character varying, pusername character varying, lib_id integer, pass character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF ((userType='patron' AND (SELECT COUNT(*) FROM patrons 
 		 WHERE username=pusername AND password=pass)=1)
        OR 
(userType='librarian' AND (SELECT COUNT(*) FROM 
 		librarians WHERE lid=lib_id AND password=pass)=1)) 
       		THEN RETURN true;
    ELSE RETURN false;
    END IF;
END; $$;
 }   DROP FUNCTION public.login(usertype character varying, pusername character varying, lib_id integer, pass character varying);
       public          postgres    false            ?            1255    41779    remove_specific_book(integer)    FUNCTION     D  CREATE FUNCTION public.remove_specific_book(delete_bid integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF(SELECT COUNT(*) FROM books WHERE isbn=(SELECT isbn FROM 
       books WHERE bid=delete_bid))=1 THEN
    BEGIN
        DELETE FROM checkout WHERE bid =delete_bid;
        DELETE FROM bookinfo WHERE isbn= (SELECT isbn FROM books WHERE bid=delete_bid);
		DELETE FROM books WHERE bid=delete_bid;
        END;
     ELSE
       BEGIN
        DELETE FROM checkout WHERE bid = delete_bid;
		DELETE FROM books WHERE bid=delete_bid;
       END;
       END IF;
END; $$;
 ?   DROP FUNCTION public.remove_specific_book(delete_bid integer);
       public          postgres    false            ?            1255    41780    update_holds()    FUNCTION     C  CREATE FUNCTION public.update_holds() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE holds
SET available_on = NOW(), bid=NEW.bid
WHERE request_on = (SELECT MIN(request_on) FROM holds JOIN books ON holds.isbn=books.isbn WHERE books.bid=NEW.bid AND available_on IS NULL GROUP BY books.isbn);
RETURN NEW;
END
$$;
 %   DROP FUNCTION public.update_holds();
       public          postgres    false            ?            1255    41781    update_late_fee()    FUNCTION     ^  CREATE FUNCTION public.update_late_fee() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF(cal_late_fee(date(NEW.check_in_date),date(OLD.check_out_date)))>20
	THEN
	  UPDATE patrons
	  SET late_fee_amount =late_fee_amount+20
	  WHERE username=OLD.username AND (date(NEW.check_in_date)-
                    date(OLD.check_out_date))>21;
	ELSE
	  UPDATE patrons
	  SET late_fee_amount=late_fee_amount+cal_late_fee( 
           date(NEW.check_in_date),date(OLD.check_out_date))
	  WHERE username=OLD.username AND (date(NEW.check_in_date)-
   date(OLD.check_out_date))>21;
	END IF;
  RETURN NEW;
END
$$;
 (   DROP FUNCTION public.update_late_fee();
       public          postgres    false            ?            1255    41782    update_onholds_bookava()    FUNCTION     2  CREATE FUNCTION public.update_onholds_bookava() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF (SELECT COUNT(*) FROM books_status_view WHERE isbn = NEW.isbn AND status='IN' AND format<>'Physical')>0
	THEN
		RAISE EXCEPTION 'This book is currently available online';
	END IF;
	RETURN NEW;
END
$$;
 /   DROP FUNCTION public.update_onholds_bookava();
       public          postgres    false            ?            1259    41783    bookinfo    TABLE     ?   CREATE TABLE public.bookinfo (
    isbn character(13) NOT NULL,
    title character varying(50) NOT NULL,
    author character varying(50),
    category character varying(50) NOT NULL,
    format character(1) NOT NULL
);
    DROP TABLE public.bookinfo;
       public         heap    postgres    false            ?            1259    41786    books    TABLE     Y   CREATE TABLE public.books (
    bid integer NOT NULL,
    isbn character(13) NOT NULL
);
    DROP TABLE public.books;
       public         heap    postgres    false            ?            1259    41789    checkout    TABLE     A  CREATE TABLE public.checkout (
    bid integer NOT NULL,
    username character varying(20) NOT NULL,
    check_out_date timestamp(0) without time zone DEFAULT now() NOT NULL,
    check_in_date timestamp(0) without time zone,
    CONSTRAINT co_ck CHECK (((check_in_date IS NULL) OR (check_out_date <= check_in_date)))
);
    DROP TABLE public.checkout;
       public         heap    postgres    false            ?            1259    41794    holds    TABLE     J  CREATE TABLE public.holds (
    username character varying(20) NOT NULL,
    isbn character(13) NOT NULL,
    request_on timestamp(0) without time zone DEFAULT now() NOT NULL,
    available_on timestamp(0) without time zone,
    bid integer,
    CONSTRAINT h_ck CHECK (((available_on IS NULL) OR (request_on <= available_on)))
);
    DROP TABLE public.holds;
       public         heap    postgres    false            ?            1259    41799    books_status_view    VIEW     ?  CREATE VIEW public.books_status_view AS
 SELECT books.bid,
    bookinfo.title,
    bookinfo.author,
    bookinfo.isbn,
    bookinfo.category,
        CASE
            WHEN (bookinfo.format = 'A'::bpchar) THEN 'AudioBook'::text
            WHEN (bookinfo.format = 'E'::bpchar) THEN 'EBook'::text
            WHEN (bookinfo.format = 'P'::bpchar) THEN 'Physical'::text
            ELSE NULL::text
        END AS format,
        CASE
            WHEN (books.bid IN ( SELECT holds.bid
               FROM public.holds
              WHERE (holds.bid IS NOT NULL))) THEN 'ON HOLD'::text
            WHEN (books.bid IN ( SELECT books_1.bid
               FROM public.books books_1
            EXCEPT
             SELECT checkout.bid
               FROM public.checkout
              WHERE (checkout.check_in_date IS NULL))) THEN 'IN'::text
            ELSE 'OUT'::text
        END AS status
   FROM (public.bookinfo
     JOIN public.books USING (isbn))
  ORDER BY bookinfo.title,
        CASE
            WHEN (bookinfo.format = 'A'::bpchar) THEN 'AudioBook'::text
            WHEN (bookinfo.format = 'E'::bpchar) THEN 'EBook'::text
            WHEN (bookinfo.format = 'P'::bpchar) THEN 'Physical'::text
            ELSE NULL::text
        END;
 $   DROP VIEW public.books_status_view;
       public          postgres    false    202    205    204    204    203    203    202    202    202    202            ?            1259    41804    cards    TABLE     ?   CREATE TABLE public.cards (
    cid character(10) NOT NULL,
    username character varying(20) NOT NULL,
    lid integer NOT NULL,
    issued_date timestamp(0) without time zone DEFAULT now() NOT NULL,
    reason character varying(15) NOT NULL
);
    DROP TABLE public.cards;
       public         heap    postgres    false            ?            1259    41808    patrons    TABLE       CREATE TABLE public.patrons (
    username character varying(20) NOT NULL,
    password character varying(20) NOT NULL,
    fname character varying(50) NOT NULL,
    lname character varying(50) NOT NULL,
    dob date NOT NULL,
    address character varying(100) NOT NULL,
    phone_number character(12) NOT NULL,
    email character varying(50),
    created_date date DEFAULT now(),
    late_fee_amount numeric(5,2) DEFAULT 0.00,
    CONSTRAINT p_ck CHECK ((((email IS NULL) OR ((email)::text ~~ '%@%.%'::text)) AND (dob < now())))
);
    DROP TABLE public.patrons;
       public         heap    postgres    false            ?            1259    41814    late_fee_view    VIEW       CREATE VIEW public.late_fee_view AS
 SELECT patrons.username,
    patrons.fname,
    patrons.lname,
    ('$ '::text || patrons.late_fee_amount) AS late_fee_amount
   FROM public.patrons
  ORDER BY ('$ '::text || patrons.late_fee_amount) DESC, patrons.username;
     DROP VIEW public.late_fee_view;
       public          postgres    false    208    208    208    208            ?            1259    41818 
   librarians    TABLE     ?   CREATE TABLE public.librarians (
    lid integer NOT NULL,
    password character varying(20) NOT NULL,
    fname character varying(50) NOT NULL,
    lname character varying(50) NOT NULL,
    CONSTRAINT l_ck CHECK ((lid >= 1000))
);
    DROP TABLE public.librarians;
       public         heap    postgres    false            T          0    41783    bookinfo 
   TABLE DATA           I   COPY public.bookinfo (isbn, title, author, category, format) FROM stdin;
    public          postgres    false    202   i       U          0    41786    books 
   TABLE DATA           *   COPY public.books (bid, isbn) FROM stdin;
    public          postgres    false    203   ?q       X          0    41804    cards 
   TABLE DATA           H   COPY public.cards (cid, username, lid, issued_date, reason) FROM stdin;
    public          postgres    false    207   Fu       V          0    41789    checkout 
   TABLE DATA           P   COPY public.checkout (bid, username, check_out_date, check_in_date) FROM stdin;
    public          postgres    false    204   ?u       W          0    41794    holds 
   TABLE DATA           N   COPY public.holds (username, isbn, request_on, available_on, bid) FROM stdin;
    public          postgres    false    205   ,w       Z          0    41818 
   librarians 
   TABLE DATA           A   COPY public.librarians (lid, password, fname, lname) FROM stdin;
    public          postgres    false    210   ?w       Y          0    41808    patrons 
   TABLE DATA           ?   COPY public.patrons (username, password, fname, lname, dob, address, phone_number, email, created_date, late_fee_amount) FROM stdin;
    public          postgres    false    208   0x       ?
           2606    41823    bookinfo bookinfo_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.bookinfo
    ADD CONSTRAINT bookinfo_pkey PRIMARY KEY (isbn);
 @   ALTER TABLE ONLY public.bookinfo DROP CONSTRAINT bookinfo_pkey;
       public            postgres    false    202            ?
           2606    41825    books books_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (bid);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public            postgres    false    203            ?
           2606    41827    librarians librarians_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.librarians
    ADD CONSTRAINT librarians_pkey PRIMARY KEY (lid);
 D   ALTER TABLE ONLY public.librarians DROP CONSTRAINT librarians_pkey;
       public            postgres    false    210            ?
           2606    41829    patrons patrons_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.patrons
    ADD CONSTRAINT patrons_pkey PRIMARY KEY (username);
 >   ALTER TABLE ONLY public.patrons DROP CONSTRAINT patrons_pkey;
       public            postgres    false    208            ?
           2606    41831    cards pk_ci 
   CONSTRAINT     J   ALTER TABLE ONLY public.cards
    ADD CONSTRAINT pk_ci PRIMARY KEY (cid);
 5   ALTER TABLE ONLY public.cards DROP CONSTRAINT pk_ci;
       public            postgres    false    207            ?
           2606    41833    checkout pk_co 
   CONSTRAINT     g   ALTER TABLE ONLY public.checkout
    ADD CONSTRAINT pk_co PRIMARY KEY (bid, username, check_out_date);
 8   ALTER TABLE ONLY public.checkout DROP CONSTRAINT pk_co;
       public            postgres    false    204    204    204            ?
           2606    41835    holds pk_hold 
   CONSTRAINT     W   ALTER TABLE ONLY public.holds
    ADD CONSTRAINT pk_hold PRIMARY KEY (username, isbn);
 7   ALTER TABLE ONLY public.holds DROP CONSTRAINT pk_hold;
       public            postgres    false    205    205            ?
           2620    41836    bookinfo tr_can_deletebookisbn    TRIGGER     ?   CREATE TRIGGER tr_can_deletebookisbn BEFORE DELETE ON public.bookinfo FOR EACH ROW EXECUTE FUNCTION public.check_can_deletebookisbn();
 7   DROP TRIGGER tr_can_deletebookisbn ON public.bookinfo;
       public          postgres    false    202    213            ?
           2620    41837    books tr_can_deletespecificbook    TRIGGER     ?   CREATE TRIGGER tr_can_deletespecificbook BEFORE DELETE ON public.books FOR EACH ROW EXECUTE FUNCTION public.check_can_deletespecificbook();
 8   DROP TRIGGER tr_can_deletespecificbook ON public.books;
       public          postgres    false    214    203            ?
           2620    41838    holds tr_check_hold_ava    TRIGGER     ?   CREATE TRIGGER tr_check_hold_ava AFTER INSERT ON public.holds FOR EACH ROW WHEN ((new.bid IS NULL)) EXECUTE FUNCTION public.check_hold_ava();
 0   DROP TRIGGER tr_check_hold_ava ON public.holds;
       public          postgres    false    216    205    205            ?
           2620    41839    checkout tr_check_holds    TRIGGER     ?   CREATE TRIGGER tr_check_holds AFTER UPDATE OF check_in_date ON public.checkout FOR EACH ROW WHEN ((new.check_in_date IS NOT NULL)) EXECUTE FUNCTION public.update_holds();
 0   DROP TRIGGER tr_check_holds ON public.checkout;
       public          postgres    false    204    204    204    236            ?
           2620    41840    checkout tr_checkout    TRIGGER     s   CREATE TRIGGER tr_checkout BEFORE INSERT ON public.checkout FOR EACH ROW EXECUTE FUNCTION public.check_checkout();
 -   DROP TRIGGER tr_checkout ON public.checkout;
       public          postgres    false    204    215            ?
           2620    41841    checkout tr_late_fee    TRIGGER     ?   CREATE TRIGGER tr_late_fee AFTER UPDATE OF check_in_date ON public.checkout FOR EACH ROW WHEN ((new.check_in_date IS NOT NULL)) EXECUTE FUNCTION public.update_late_fee();
 -   DROP TRIGGER tr_late_fee ON public.checkout;
       public          postgres    false    204    204    237    204            ?
           2620    41842    holds tr_onholds_bookava    TRIGGER        CREATE TRIGGER tr_onholds_bookava BEFORE INSERT ON public.holds FOR EACH ROW EXECUTE FUNCTION public.update_onholds_bookava();
 1   DROP TRIGGER tr_onholds_bookava ON public.holds;
       public          postgres    false    205    238            ?
           2606    41843    cards cards_lid_fkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_lid_fkey FOREIGN KEY (lid) REFERENCES public.librarians(lid);
 >   ALTER TABLE ONLY public.cards DROP CONSTRAINT cards_lid_fkey;
       public          postgres    false    210    2756    207            ?
           2606    41848    cards cards_username_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_username_fkey FOREIGN KEY (username) REFERENCES public.patrons(username);
 C   ALTER TABLE ONLY public.cards DROP CONSTRAINT cards_username_fkey;
       public          postgres    false    208    207    2754            ?
           2606    41853    checkout checkout_bid_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.checkout
    ADD CONSTRAINT checkout_bid_fkey FOREIGN KEY (bid) REFERENCES public.books(bid);
 D   ALTER TABLE ONLY public.checkout DROP CONSTRAINT checkout_bid_fkey;
       public          postgres    false    203    2746    204            ?
           2606    41858    checkout checkout_username_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.checkout
    ADD CONSTRAINT checkout_username_fkey FOREIGN KEY (username) REFERENCES public.patrons(username);
 I   ALTER TABLE ONLY public.checkout DROP CONSTRAINT checkout_username_fkey;
       public          postgres    false    208    204    2754            ?
           2606    41863    books fk_books    FK CONSTRAINT     ?   ALTER TABLE ONLY public.books
    ADD CONSTRAINT fk_books FOREIGN KEY (isbn) REFERENCES public.bookinfo(isbn) ON DELETE CASCADE;
 8   ALTER TABLE ONLY public.books DROP CONSTRAINT fk_books;
       public          postgres    false    2744    203    202            ?
           2606    41868    holds holds_bid_fkey    FK CONSTRAINT     p   ALTER TABLE ONLY public.holds
    ADD CONSTRAINT holds_bid_fkey FOREIGN KEY (bid) REFERENCES public.books(bid);
 >   ALTER TABLE ONLY public.holds DROP CONSTRAINT holds_bid_fkey;
       public          postgres    false    205    2746    203            ?
           2606    41873    holds holds_isbn_fkey    FK CONSTRAINT     v   ALTER TABLE ONLY public.holds
    ADD CONSTRAINT holds_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.bookinfo(isbn);
 ?   ALTER TABLE ONLY public.holds DROP CONSTRAINT holds_isbn_fkey;
       public          postgres    false    205    2744    202            ?
           2606    41878    holds holds_username_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.holds
    ADD CONSTRAINT holds_username_fkey FOREIGN KEY (username) REFERENCES public.patrons(username);
 C   ALTER TABLE ONLY public.holds DROP CONSTRAINT holds_username_fkey;
       public          postgres    false    208    205    2754            T   Y  x??Y[O?H~.~E???jX???_VB??&"??H?R?ER?Ŗ?@???wl'\???$?*-u??s?s???r'?F????N?1>??J???L%??Z?????_??B?v"J+?*<'lm?>?U????????DeV钍??8q???C???7??(snaa?M&>?W|lu)7??e??b[]\A&^???U??????~??;Qna?\??? u??ve??Tcz?e???5 ??cs?????a?uNq??6?ll9???I??l??0G^???c)??X??B?U۔Y?? 	??R????d?u<60R????T??S1g??`,??b#--ܸ׆????????}~??w?7*? މ????i????W^?????????J?n??{???m?Q??:??t???Bd????(?@????????|???%??H???~U?z??h???Q?*t`{z쌋9??-Bĳ?j>???x?7:??=?P???k???	,?	???a??????????m?uB*=?w?vU.????0?F<o??$L??O?д?$?i?y?D?F???В_j?S?e??o?$T?~:???ł?@?Ǧe%i?DA؞??F1mq?Q?Ǡ???z???:?h??3]??ʪF?7~?&?,?I?????PUʜ_?????Y,G8itӮZ????4?^???TU??-}???Rb%?/?EV??+Q?r;?=/?#?l{~??Hٹ?v?	|J?}dD6kP?????Y	PxT????0b6%Z';?O? ??w/O5es,? I6u???^1?F???+??"?2?X??Jd ?j.A?0??x???,??xrv4UEnd	?O??P?7?^?:?2MoI0);?|ن??N??8h؄?#8?V??}?
QU?k?V?9	??sm:??(/h?Ý???H\WK?O䂵??;|y??xy????1 ??|?s??I :???j?
'??{N?_??Q?z??7'?)??4k?N?M??;??Fqh?K?oD1k6Ek?????G??X?{?zR|?RЫ3@q?????tb9???Q}R??"D?'???h??ܶMQBg7?W,*:??g?c ?o%S??????T?6?DF?&3?ٻPsvXWT????ȹ,m? v!O*??/?|C??~???}('
c*>?U.??^???????l??k??\ɒ???Ĉ??~??k?z????N??i???~?.k??}{.???v????<?'$?>????ϯ?(?؇a??{V?&/?w????????	??????d?????????G?W??h??2E??n??i?"`G4???mE?Rvڹ?"K?塥v?cTicU`X?????ǌ?ؑ0P;?=X?
??}?Za?F???q@? ?jp?N????ɡ??P?=? ???????????xmE????Ġ?`n&??
?8??w?X`w???G>ʒ?????&̻?1?q?Iʀ??????P??2?N???L?57G??P?͙?Y??y3an? ?ѹ???F?ߋr??P0$?(??L????$?h?եCk,?օ?#c????p??2o8?f??Ѝ???(?>6???ա:??zΧ??U8?B?	Ý$J)?h???&1??չ?,?^?,?:???&aw???k??3?RBW[??	 ?$?!D?c?h??0?????؋???2?lv?Ǡ*P???????I??? e=> ??c7S?acL??????*???;?eà??~?D???ў?w$,7C???=?8??B?
[?t+??\??*vh?q??(sL*??ab?#Aܪ?"??d??쇩?B z&????!x>-??e?C??]?B????%?ǟ5?F`?M??u?И??hv?ĭp @?e?̷r-B"I??^??ݢd??K<fMe????`??7??J)4?E?mZŐ(9?F?u??aџ?s??넑??A???a=???F!?tً[/.Ѩ??~T ???z|};????J?Z??ý!????1?p?v?.A11?.hZ'????O??V?{?K???<QR????zg9?^I??զ?D?e???$\3?????<;!d??r??$?׼#م??YO?x?ۑ/????????????Wmn????^???8X?Nޥ???s?????4a      U   ?  x?e?k?!?????????H;2???&[~?qZ@?	s"??Cd?Qֲ?]??ִ?gY?g=????~ѧ0q#??+?s6?
???%??1F#??+?x+?ٻ?+7?
??? v1j,\JI?$ fV?WH?6z??.ܑU? ?*?6y?!h??8n?????D<?PҤW@??+?M??-??_??D*? ? ;??/a??	"l?????M{T?V:?o?tT ??5??)??6}??@~?>Jq[%??R??:??+?
?R3_:??@???6??G)A.??
n???sx???EmLfnv?!ڌ+?C(??L*?C8Ձ~dy_L֗?4?P@??}???_??W@?n??<????$ʷ?pt?X?sy??͵?????X^A??T?4???\???RJ?Uɑ7흥?Nv?8wEӶ
??,K??)B?β	M3?my
K?E?@n??E?Kd?"???ZOу̃???Z????A??mFd??u??ܟ2r??U? r=????:=?dkƩ?j" QI?R?]?j? t>?H5?????]CM?:?z??bI?8~N???!iP_?㬸L8?#?iQ_2?Y
?I??	??I?_?@??F?6????q}?.g?~W?U	i]?????z}=??K? ? r?40?]? i?? ?8W:????!(-KU????'????O?֗?A???.?<???A?Э?	???5?Ջ攱?0?HT2?ss??Ϥ??AF????Y??Ar2?:?p+b?a_???????A??5_]?$5_`?,?8?D_??????!?f?YZ??y!OAǢ@???g?^?yE?I?m5o???S???????	q?{?-??3?6?mz?$?Z?5??{?gQߧ?ј???D???k?KqD#?Y'?4?۩?!?? ߡ?? ?4p?1N|??}??A??=?????ok???]?H      X   ?   x???M
?0?ur
/P??O?9?+w?$Ԙci*??VQ?-|3?de4???d87L??T#`??$*??y(???Y?? ?	i??۩&?$!?R??R?]?ᾤ`??J???v9u?샭i-	??W????R|tK?	6???-s?:??<?ye?[B ????5??n]
      V   !  x???In?0E??)r????!z?lT4u???r?J2҅?? W???/l????|?Ɵ?S(PЀn?0A?8?KTu?eHWӮs)??mE?Bos??*?Ҵ?b??S7Ư??5??N?H?N??T?12R?-r????a8??&i?L??S?>-(WXSmP娖??2?=j?Z8G??Q???m΀D?H?*?A??݊G?|??C̾,+?C??%So=[??? ??w???^S??`[A??G??8???p?p??@e?v(j  ?D)??o1???b__?Ң?P?7)?/?)      W   o   x?m?1?0???? ?????,, !$?P??o+"???????l????܆??5#Ŭ?C??#c?+??s??P{(C?u??$1]????u????????n?d4OD??_.?      Z   u   x??1
1F???)<?L?f 
k#Z?l?u$?e&x~ٴ????{2#?l??	?\w??<??񔕵??b?t@p??\JN??q??wV???	??*?}??HKeíȏ?-g??<&?      Y   p  x??V?r?8|}?????;???6e9??UyIФE
@JE}?xH????ԅ?????b??X^??"?s?3xl+???m q??I ?\keE?ʬ??_Y?l?cW???+?uB "????|ׇ_+?ql???g?8?p????ʊ??ϛ???Ǜ;??????4e	?9?m~?B?FI?	??biь?!~?a#??z??j??????yYU<<???n?'??ڻ???a>&?V?o{˸??hD$???L?T?o;ѹ?-???f;?>?t??{?GJ?:??|??5!D?B?~?͊?}?2?;2:ޙD?l8|?&>?M?jXo˺@?????s#???^?[r?m?8????'N`ס!Qs?D?0V??6???*9?7?-S?!4???.,S?-vr?{?w?EH????g??Qx?2iw?xV???s???????p#2?z??9?0????"????'?/?H%????t?ހ? ???,?KXoʲ?Zk|j+????\M????k?Ǌ?z?Ld\@]csb{1??m??Sk??ԛM?K]^k??h??lI?^???4?%?뵵?????+Һ?8SVs5????:1?3??=W?Q?%??q?> r?y*???????)?z???ZwVEC???Aw?s??Gf
?g??x?-?B:ˏ:?૮??$5?/?Bs?ǋX?M?w?w??K=SB?|;&?;@z&pH:Ȅ??n?wL??T<???èS?? A???	?$?,D	??{T???ɠ3?bb?c??1? Sww"??=??Uɪ?N??ߏ??ᖕu???????pO<|?v????E?;??j??OẎ}???j?;{??^??6???S欆?j$MUYo".?n?"???~ݲB?q?gy1(?l?{ S섫?~????z녲*)w?]???,L:M+?ژe?F{????k??a??'|c?Lt?'??@?????O???l??????????p??I ??N<?759.:ݡ???t?????3\???Y??S7????U????BF?ƌ???N???s9ic??e?Y?㈬tg??t??Z??r??[??&??pJhoo???Josrc?c???`?lto??Dn?S?x??U?+QX?????=??g???9v??w'r??yZ????gP*:ۿnpo5u?p?A?+|?ā?g???~7?????p?<s?X??w?~??????F????酩yv???<??'?+?i?xޭ1:^?<,??\T?F??=????r^???E?X??ٽ?W?eZp?Q??ؖ??J(?g}}???ZN??;?;?=?}?.????2]W?&e?RW?X????????? ??\Dq????N?6?L???B6??6s1?0??ј??r?X???-G     