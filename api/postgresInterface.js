const { Client } = require("pg");

class PostgresInterface {
  /* ------------------------------------------------------------------------------------------------------------------- */
  constructor(connectionString) {
    this.connectionString = connectionString;
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async connect() {
    const client = new Client({ connectionString: this.connectionString });
    try {
      await client.connect();
    } catch (e) {
      console.log(e);
    }
    return client; // returns client object to query, must close each use
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async close(client) {
    try {
      await client.end();
    } catch (e) {
      console.log(e);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //create a new patron
  async createNewPatron(user, pass, fn, ln, DOB, addr, phone, email) {
    console.log('OOO',user, pass, fn, ln, DOB, addr, phone, email);
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO patrons
                VALUES ('${user}','${pass}','${fn}','${ln}','${DOB}','${addr}','${phone}','${email}');
            `);
    } catch (e) {
      await this.close(client);
      console.log(e);
      return e;
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //create a new librarian
  async createNewLibrarian(LID, pass, fn, ln) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO librarians
                VALUES (${LID},'${pass}','${fn}','${ln}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //librarian issue a card
  async issueNewCard(CID, user, LID, reason) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO cards
                VALUES ('${CID}','${user}','${LID}',DEFAULT,'${reason}');
            `);
    } catch (e) {
      await this.close(client);
      return e;
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //checkout a book
  async checkoutBook(bid, user) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO checkout
                VALUES (${bid},'${user}',DEFAULT,NULL);
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //Checkout a hold
  async checkoutAHold(bid, user) {
    const client = await this.connect();
    try {
      await client.query(`
        SELECT checkout_hold_book(${bid},'${user}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  // online Checkout for patrons to checkout 'A' or 'E' book
  async onlineCheckout(isbn, user) {
    var avaBooks = await this.availableBook(isbn);
    if (avaBooks.length > 0) await this.checkoutBook(avaBooks[0]["bid"], user);
    else console.log("No book availble with ISBN " + isbn+" (check not checkout a physical book)");
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //patron can place a hold on 'P' book when available or not available or 'E' and 'A' when not available
  async placeHold(user, isbn) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO holds
                VALUES ('${user}','${isbn}',DEFAULT,NULL,NULL);
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //browse entire book list 
  async browseBook() {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
          SELECT title, author, isbn, format, category, (COUNT(*)-(SELECT countNotAvaBook(isbn))) AS availableCount
          FROM books_status_view 
          GROUP BY isbn,title, author, format, category
          ORDER BY title;
      `);
      await this.close(client);
      return rows;
    } catch (error) {
      await this.close(client);
      console.log(error);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //search for a specific book
  async searchBook(search, by) {
    const client = await this.connect();
    try {
      if (by == "format") {
        const { rows } = await client.query(`
          SELECT title, author, isbn, format, category, (COUNT(*)-(SELECT countNotAvaBook(isbn))) AS availableCount
          FROM books_status_view 
          WHERE lower(${by}) LIKE '${search.substring(0, 1).toLowerCase()}%'
          GROUP BY isbn,title, author, format, category
          ORDER BY title;
                `);
        await this.close(client);
        return rows;
      } else {
        const { rows } = await client.query(` 
          SELECT title, author, isbn, format, category, (COUNT(*)-(SELECT countNotAvaBook(isbn))) AS availableCount
          FROM books_status_view 
          WHERE lower(${by}) LIKE '%${search.toLowerCase()}%'
          GROUP BY isbn,title, author, format,category
          ORDER BY title;
                `);
        await this.close(client);
        return rows;
      }
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //view all information on a book
  async viewAll(table) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * 
                FROM ${table};
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //view a patron's information
  async viewPatronInfo(username) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT Fname,Lname,DOB,Address,Phone_Number, email, created_date, cid,'$ '||late_fee_amount AS late_fee_amount
                FROM patrons LEFT OUTER JOIN cards ON patrons.username=cards.username
                WHERE issued_date= (SELECT MAX(issued_date) FROM cards WHERE username='${username}') 
                  OR (issued_date IS NULL and patrons.username='${username}');
				
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewPatronInfoBy(search, by, amount,operator) {
    const client = await this.connect();
    try {
      if (search === 'all'){
        const { rows } = await client.query(`
                  SELECT username, Fname || ' ' || Lname AS name,DOB,Address,Phone_Number, email, created_date, '$ '||late_fee_amount AS late_fee_amount
                  FROM patrons
              `);
        await this.close(client);
        return rows;
      }
      else if (by == "late_fee_ammount") {
        const { rows } = await client.query(`
                  SELECT username, Fname || ' ' || Lname AS name,DOB,Address,Phone_Number, email, created_date, '$ '||late_fee_amount AS late_fee_amount
                  FROM patrons
                  WHERE  ${by} ${operator} ${amount};
              `);
        await this.close(client);
        return rows;
    }
    else if (by == "name"){
      const { rows } = await client.query(`
        SELECT username, fname || ' ' || lname AS name,DOB,Address,Phone_Number, email, created_date, '$ '||late_fee_amount AS late_fee_amount
        FROM patrons
        WHERE lower(fname || ' ' || lname) LIKE '%${search.toLowerCase()}%'; 
        `);
      await this.close(client);
      return rows;
    }
    else {
      const { rows } = await client.query(`
        SELECT username, fname || ' ' || lname AS name,DOB,Address,Phone_Number, email, created_date, '$ '||late_fee_amount AS late_fee_amount
        FROM patrons
        WHERE lower(${by}) LIKE '%${search.toLowerCase()}%'
        `);
      await this.close(client);
      return rows;
    }

    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  /* ------------------------------------------------------------------------------------------------------------------- */
  //patron pay late fee
  async payFee(username) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        UPDATE patrons 
        SET late_fee_amount=0
        WHERE username='${username}';
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //Allow patron or librarian to login
  async authenticateLogin(user, pusername, lib_id, pass) {
    //'null' if not apply to any argument, ex: authenticateLogin('patron', 'qizheng2', 'NULL','bogarted')
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * FROM login ('${user}', '${pusername}', ${lib_id},'${pass}');
            `);
      await this.close(client);
      return rows[0]["login"];
    } catch (e) {
      console.log(e);
      await this.close(client);
      return false;
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //view all checkout history for a patron
  async viewCheckoutHistory(user) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
		  SELECT bid,title,author,ISBN,check_out_date,check_in_date,format
          FROM
              (SELECT * 
              FROM patrons NATURAL JOIN checkout 
              WHERE username = '${user}') AS books_checkout_by_user 
              NATURAL JOIN books NATURAL JOIN bookinfo
          ORDER BY check_out_date DESC;
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //Check all holds history for a patron, a table
  async checkMyHold(user) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
          SELECT * FROM checkMyHold('${user}');
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //check all holds history for librarian
  async checkAllHold() {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
          SELECT * FROM checkAllHolds() ORDER BY b_username;
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //Result a table of available book based on the isbn for 'E' and 'A'
  async availableBook(isbn) {
    //for online checkout: return all books with isbn that has not been checkout
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * FROM
                (SELECT BID FROM books NATURAL JOIN bookinfo WHERE ISBN = '${isbn}' AND Format IN ('E','A') 
                    EXCEPT
                    (SELECT BID 
                    FROM checkout 
                    WHERE check_In_Date IS NULL)) 
                    AS available;
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  /* ------------------------------------------------------------------------------------------------------------------- */
  //update the check_in_date when a book is check in
  async checkinBook(bid) {
    //book check in and update if there is a late fee or not
    const client = await this.connect();
    try {
      await client.query(`
                UPDATE checkout
                SET check_In_Date = NOW()
                WHERE bid = ${bid} AND check_in_date IS NULL;
            `);
      await this.close(client);
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  /* -------------------------------------------------------------------------------------------------------------------*/
  //a list of books in the library with its current status
  async bookStatus() {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * FROM Books_Status_View;
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* -------------------------------------------------------------------------------------------------------------------*/
  //librarian can view all the unpay late fee and patron can view their, late fee will not pass $20
  async viewLateFee(user, id) {
    const client = await this.connect();
    try {
      if (user === "librarian" && id === "null") {
        const { rows } = await client.query(`
                    SELECT * FROM Late_Fee_View;
                `);
        await this.close(client);
        return rows;
      } else if (user === "patron" && id != "null") {
        const { rows } = await client.query(`
                    SELECT * 
                    FROM late_fee_view 
                    WHERE username='${id}';
                `);
        await this.close(client);
        return rows;
      }
      await this.close(client);
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /*-------------------------------------------------------------------------------------------------------------------*/
  //add book to books tables: add book to librarian
  async addBookToBooks(isbn) {
    const client = await this.connect();
    try {
      await client.query(`
        SELECT add_book_to_lib('${isbn}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /*-------------------------------------------------------------------------------------------------------------------*/
  //Add books to bookinfo tables: add book to entire book database
  async addBookToBookInfo(isbn, title, author, category, format) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO Bookinfo VALUES ('${isbn}', '${title}','${author}','${category}','${format}');
            `);
    } catch (e) {
      console.log(e);
      await this.close(client);
      return e;
    }
    await this.close(client);
  }
  /*-------------------------------------------------------------------------------------------------------------------*/
  //remove a specific book with bid
  async removeSpecificBook(bid) {
    const client = await this.connect();
    try {
      await client.query(`
          SELECT remove_specific_book(${bid});
      `);
    } catch (e) {
      await this.close(client);
      return e;
    }
    await this.close(client);
  }
  /*-------------------------------------------------------------------------------------------------------------------*/
  //database automatic remove books from books table that have same isbn
  async removeBookBasedOnISBN(isbn) {
    const client = await this.connect();
    try {
      await client.query(`
                DELETE FROM bookinfo WHERE isbn='${isbn}';
            `);
    } catch (e) {
      await this.close(client);
      console.log(e);
      return e;
    }
    await this.close(client);
  }

  async getLibrarianName(lid) {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT fname
                FROM librarians
                WHERE lid = ${lid};
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async query(select,from,where){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT ${select}
                FROM ${from}
                WHERE ${where};
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewCheckoutsByBook(isbn){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT bid, username, check_out_date, title, books.isbn 
        FROM checkout NATURAL JOIN books JOIN bookinfo ON books.isbn = bookinfo.isbn
        WHERE check_in_date IS NULL AND books.isbn='${isbn}';
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewCheckoutsByUser(user){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT bid, username, check_out_date, title, books.isbn 
        FROM checkout NATURAL JOIN books JOIN bookinfo ON books.isbn = bookinfo.isbn
        WHERE check_in_date IS NULL AND username='${user}';
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewHoldsByBook(isbn){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT username, request_on, available_on, bid, title, isbn
        FROM holds NATURAL JOIN bookinfo
        WHERE isbn='${isbn}';
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewHoldsByUser(user){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT username, request_on, available_on, bid, title, isbn, format
        FROM holds NATURAL JOIN bookinfo
        WHERE username='${user}';
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewActiveCheckouts(){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM checkout NATURAL JOIN books JOIN bookinfo ON books.isbn = bookinfo.isbn 
        WHERE check_in_date IS NULL;
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  async viewCheckoutByBID(bid){
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM checkout NATURAL JOIN books JOIN bookinfo ON books.isbn = bookinfo.isbn 
        WHERE check_in_date IS NULL AND bid = ${bid};
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
 
  async checkout_lib(bid, cid) {
    const client = await this.connect();
    try {
      await client.query(`
        SELECT checkout_physical (${bid}, '${cid}');
            `);
    } catch (e) {
      await this.close(client);
      return e;
    }
    await this.close(client);
  }


  async lib_checkout_hold(bid, username) {
    const client = await this.connect();
    try {
      await client.query(`
        select lib_checkout_hold(${bid}, '${username}');`);
    } catch (e) {
      await this.close(client);
      return e;
    }
    await this.close(client);
  }

  async remove_hold(username, isbn) {
    const client = await this.connect();
    try {
      await client.query(`
          DELETE FROM holds WHERE username ='${username}' and ISBN='${isbn}';`);
    } catch (e) {
      await this.close(client);
      return e;
    }
    await this.close(client);
  }

}





/* ------------------------------------------------------------------------------------------------------------------- */
module.exports = { PostgresInterface: PostgresInterface };
/* ------------------------------------------------------------------------------------------------------------------- */

// SELECT *, pg_terminate_backend(pid) 
// FROM pg_stat_activity 
// WHERE usename='postgres';