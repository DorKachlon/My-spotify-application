const mysql = require("mysql");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const mysqlCon = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "spotify",
    multipleStatements: true,
});

mysqlCon.connect(function (err) {
    if (err) {
        console.log(
            `try to connect ${process.env.USER} ${process.env.PASSWORD} and fail`
        );
        throw err;
    }
    console.log("Connected to DB!");
});

//GET
app.get("/search", (req, res) => {
    let sql = ` SELECT artist.name FROM artist
    WHERE artist.name like "%${req.query.params}%"
    UNION
    SELECT song.name FROM song
    WHERE song.name like "%${req.query.params}%"
    UNION
    SELECT album.name FROM album
    WHERE album.name like "%${req.query.params}%"
    UNION
    SELECT playlist.name FROM playlist
    WHERE playlist.name like "%${req.query.params}%";`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});

app.get("/song/:id", (req, res) => {
    let sql = ` SELECT song.* , artist.cover_img AS artist_cover_img , album.cover_img AS album_cover_img , album.name AS album_name , artist.name AS artist_name FROM song 
            INNER JOIN artist 
    ON song.artist_id = artist.artist_id
            INNER JOIN album 
    ON song.album_id = album.album_id
        WHERE song_id = ${req.params.id}`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/song/search/:word", (req, res) => {
    let sql = `SELECT * FROM song
    WHERE song.name like "%${req.params.word}%";`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/album/:id", (req, res) => {
    // SpecificID(req, res, "album", "album_id");
    let sql = `SELECT album.*, artist.name AS artist_name, artist.cover_img AS artist_cover_img FROM album 
    INNER JOIN artist 
    ON album.artist_id = artist.artist_id
    WHERE album_id = ${req.params.id}`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/album/songs/:idAlbum", (req, res) => {
    let sql = `SELECT song.* ,artist.name AS artist_name FROM song
    INNER JOIN artist 
    ON song.artist_id = artist.artist_id
    WHERE album_id = ${req.params.idAlbum}
    order by track_number;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/album/search/:word", (req, res) => {
    let sql = `SELECT * FROM album
    WHERE album.name like "%${req.params.word}%";`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/artist/:id", (req, res) => {
    SpecificID(req, res, "artist", "artist_id");
});
app.get("/artist/songs/:idArtist", (req, res) => {
    let sql = `SELECT song.* ,artist.name AS artist_name, album.cover_img AS cover_img ,album.name AS album_name FROM song
    INNER JOIN artist 
    ON song.artist_id = artist.artist_id
        INNER JOIN album 
    ON song.album_id = album.album_id
    WHERE song.artist_id = ${req.params.idArtist}
    order by created_at desc;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/artist/search/:word", (req, res) => {
    let sql = `SELECT * FROM artist
    WHERE artist.name like "%${req.params.word}%";`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/artist/albums/:idArtist", (req, res) => {
    let sql = `SELECT album.* ,artist.name AS artist_name FROM album
    INNER JOIN artist 
    ON album.artist_id = artist.artist_id
    WHERE album.artist_id = ${req.params.idArtist}
    order by created_at desc;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/album/songs/:idAlbum", (req, res) => {
    let sql = `SELECT song.* FROM song
    WHERE album_id = ${req.params.idAlbum}
    order by track_number;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/playlist/:id", (req, res) => {
    SpecificID(req, res, "playlist", "playlist_id");
});
app.get("/playlist/songs/:idPlaylist", (req, res) => {
    let sql = `SELECT playlist_song.playlist_id,song.* ,album.cover_img,artist.name AS artist_name FROM playlist_song
    INNER JOIN song 
    ON playlist_song.song_id = song.song_id
        INNER JOIN album 
        ON song.album_id = album.album_id
            INNER JOIN artist 
        ON song.artist_id = artist.artist_id
        WHERE playlist_id=${req.params.idPlaylist};`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});
app.get("/playlist/search/:word", (req, res) => {
    let sql = `SELECT * FROM playlist
    WHERE playlist.name like "%${req.params.word}%";`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
});

function SpecificID(req, res, table, column) {
    let sql = `SELECT * FROM ${table} WHERE ${column} = ${req.params.id}`;
    mysqlCon.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Post fetched...");
        res.send(result);
    });
}

app.get("/top_songs/", (req, res) => {
    const sql = `
    SELECT song.song_id, song.name, song.artist_id,song.album_id, song.youtube_link,song.length,song.lyrics,song.created_at,artist.name AS artist_name, album.name AS album_name,album.cover_img,SUM(play_count) AS counter_player FROM interactions_by_song
    INNER JOIN song 
        ON interactions_by_song.song_id = song.song_id
    INNER JOIN artist 
        ON song.artist_id = artist.artist_id
    INNER JOIN album 
        ON song.album_id = album.album_id
    GROUP BY interactions_by_song.song_id
    ORDER BY counter_player desc
    LIMIT 20;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) {
            res.send(err.message);
            throw err;
        }
        res.send(result);
    });
});

app.get("/top_artists/", (req, res) => {
    const sql = `
    SELECT user_artist.artist_id, COUNT(user_artist.artist_id) AS counter_subscribes, artist.name, artist.cover_img, artist.upload_at FROM user_artist
    INNER JOIN artist 
        ON user_artist.artist_id = artist.artist_id
    GROUP BY user_artist.artist_id
    ORDER BY counter_subscribes desc
    LIMIT 20;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) {
            res.send(err.message);
            throw err;
        }
        res.send(result);
    });
});
app.get("/top_albums/", (req, res) => {
    const sql = `
    SELECT interactions_by_album.album_id, album.name, album.cover_img, album.created_at ,artist.name AS artist_name,SUM(interactions_by_album.play_count) AS counter_player FROM interactions_by_album
    INNER JOIN album 
        ON interactions_by_album.album_id = album.album_id
    INNER JOIN artist 
        ON album.artist_id = artist.artist_id
    GROUP BY interactions_by_album.album_id
    ORDER BY counter_player desc
    LIMIT 20;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) {
            res.send(err.message);
            throw err;
        }
        res.send(result);
    });
});
app.get("/top_playlists/", (req, res) => {
    const sql = `
    SELECT interactions_by_playlist.playlist_id, playlist.name, playlist.cover_img, playlist.created_at ,SUM(interactions_by_playlist.play_count) AS counter_player FROM interactions_by_playlist
    INNER JOIN playlist 
        ON interactions_by_playlist.playlist_id = playlist.playlist_id
    GROUP BY interactions_by_playlist.playlist_id
    ORDER BY counter_player desc
    LIMIT 20;`;
    mysqlCon.query(sql, (err, result) => {
        if (err) {
            res.send(err.message);
            throw err;
        }
        res.send(result);
    });
});

//POST
app.post("/song", (req, res) => {
    postReq(res, req, "song");
});

app.post("/album", (req, res) => {
    postReq(res, req, "album");
});

app.post("/playlist", (req, res) => {
    postReq(res, req, "playlist");
});

app.post("/artist", (req, res) => {
    postReq(res, req, "artist");
});

function postReq(req, res, table) {
    let sql = `INSERT INTO ${table} SET ?`;
    mysqlCon.query(sql, req.body, (err, result) => {
        if (err) {
            res.send(err.message);
            throw err;
        }
        res.send(result);
    });
}

//PUT
app.put("/song/:id", async (req, res) => {
    putReq(req, res, "song");
});
app.put("/artist/:id", async (req, res) => {
    putReq(req, res, "artist");
});
app.put("/album/:id", async (req, res) => {
    putReq(req, res, "album");
});
app.put("/playlist/:id", async (req, res) => {
    putReq(req, res, "playlist");
});

function putReq(req, res, table) {
    let sql = `UPDATE ${table} SET`;
    keyArray = Object.keys(req.body);
    for (const key of keyArray) {
        sql += ` ${key}='${req.body[key]}'`;
    }
    sql += `WHERE ${table}_id=${req.params.id}`;
    mysqlCon.query(sql, (error, results) => {
        if (error) {
            res.send(err.message);
            throw error;
        }
        res.send(results);
    });
}

//DELETE
app.delete("/song/:id", async (req, res) => {
    deleteReq(req, res, "song");
});
app.delete("/artist/:id", async (req, res) => {
    deleteReq(req, res, "artist");
});
app.delete("/album/:id", async (req, res) => {
    deleteReq(req, res, "album");
});
app.delete("/playlist/:id", async (req, res) => {
    deleteReq(req, res, "playlist");
});

function deleteReq(req, res, table) {
    mysqlCon.query(
        `DELETE FROM ${table} WHERE ${table}_id = ${req.params.id}`,
        (error, results) => {
            if (error) {
                res.send(err.message);
                throw error;
            }
            res.send(results);
        }
    );
}
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
