import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MyCarousel from "./MyCarousel";

import "../../styles/home.css";
export default function Home() {
    const [
        topSongsArtistPlaylistAlbum,
        setTopSongsArtistPlaylistAlbum,
    ] = useState([]);

    
    useEffect(() => {
        (async function loadTop() {
            let newArr = [];
            try {
                const { data } = await axios.get("/interaction/top_songs/");
                newArr.push(data);
                const dataArtist = await axios.get("/interaction/top_artists/");
                newArr.push(dataArtist.data);
                const dataPlaylist = await axios.get("/interaction/top_playlists/");
                newArr.push(dataPlaylist.data);
                const dataAlbum = await axios.get("/interaction/top_albums/");
                newArr.push(dataAlbum.data);
                setTopSongsArtistPlaylistAlbum(newArr);
            } catch (e) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${e.message}`,
                });
            }
        })();
    }, []);

    return (
        <>
            <h1 className="welcomeTitle">WELCOME</h1>
            <div className="carouselTopTwenty">
                {topSongsArtistPlaylistAlbum[0] && (
                    <>
                        <h2 className="topTitle">Top 20 songs</h2>
                        <MyCarousel
                            topSongsArtistPlaylistAlbum={
                                topSongsArtistPlaylistAlbum
                            }
                            i={0}
                            product={"song"}
                        />
                    </>
                )}
            </div>
            <div className="carouselTopTwenty">
                {topSongsArtistPlaylistAlbum[1] && (
                    <>
                        <h2 className="topTitle">Top 20 Artists</h2>
                        <MyCarousel
                            topSongsArtistPlaylistAlbum={
                                topSongsArtistPlaylistAlbum
                            }
                            i={1}
                            product={"artist"}
                        />
                    </>
                )}
            </div>
            <div className="carouselTopTwenty">
                {topSongsArtistPlaylistAlbum[2] && (
                    <>
                        <h2 className="topTitle">Top 20 Playlists</h2>
                        <MyCarousel
                            topSongsArtistPlaylistAlbum={
                                topSongsArtistPlaylistAlbum
                            }
                            i={2}
                            product={"playlist"}
                        />
                    </>
                )}
            </div>
            <div className="carouselTopTwenty">
                {topSongsArtistPlaylistAlbum[3] && (
                    <>
                        <h2 className="topTitle">Top 20 Albums</h2>
                        <MyCarousel
                            topSongsArtistPlaylistAlbum={
                                topSongsArtistPlaylistAlbum
                            }
                            i={3}
                            product={"album"}
                        />
                    </>
                )}
            </div>
        </>
    );
}
