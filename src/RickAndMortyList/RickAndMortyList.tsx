import React, { useEffect, useState } from "react";
import { Character, Info, ApiResponse } from "./types";
import styles from "../styles.module.css";


// Base URL of the Rick and Morty API endpoint for characters
const Base_url = "https://rickandmortyapi.com/api/character";

const RickAndMortyPaginatedList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]); // State to store the list of character fetched from api 
  const [loading, setLoading] = useState<boolean>(false); // State to track loading status durring fetch requests 
  const [error, setError] = useState<string | null>(null); // State to store any error messeage from fetch failures 
  const [page, setPage] = useState<number>(1); // state to keep track of the current paage number in pagination 
  const [info, setInfo] = useState<Info | null>(null); // State to store pagination info returned by the API (e.g., next/prev page links)
  const [statusFilter, setStatusFilter] = useState<string>(""); // State to store the current status filter value ("alive", "dead", "unknown", or "")
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store the current search query string for character names


   // Function to fetch characters from the API based on page, status, and search query
  const fetchCharacters = async (
    page: number,
    status: string,
    search: string
  ) => {
    setLoading(true);
    setError(null);

    try {

      // Build API URL with query params for page, status filter, and search query
      let url = `${Base_url}?page=${page}`;
      if (status) {
        url += `&status=${status}`;
      }
      if (search) {
        url += `&name=${search}`;
      }

      // Performing fetch request to API 
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch characters");
      }
      const data: ApiResponse = await res.json();
      setCharacters(data.results);  // Update characters state with fetched results
      setInfo(data.info); // Update pagination info state with API's info object
    } catch (err: any) {  // Setting fetch error message if fetch doesnt work 
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };


   // useEffect to fetch characters whenever page, status filter, or search query changes
  useEffect(() => {
    fetchCharacters(page, statusFilter, searchQuery);
  }, [page, statusFilter, searchQuery]);

  // Resets the page to 1 when filters ( status or search query ) changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  return (
    <div> {/* logo and title section */}
      <div className={styles.logoContainer}>
        <img src="/header_logo.png" alt="Logo" className={styles.logoImage} />
      </div>

      <h1 className={styles.title}>Rick and Morty character list</h1>

      {/* Status filter radio buttons and search bar */}
      <div className={styles.filterSearchWrapper}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Character..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterContainer}>
          <span className={styles.filterText}>Character status: </span>
          <label className={styles.mb3}>
            <input
              type="radio"
              name="status"
              value=""
              checked={statusFilter === ""}
              onChange={() => setStatusFilter("")}
            />{" "}
            All
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="alive"
              checked={statusFilter === "alive"}
              onChange={() => setStatusFilter("alive")}
            />{" "}
            Alive
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="dead"
              checked={statusFilter === "dead"}
              onChange={() => setStatusFilter("dead")}
            />{" "}
            Dead
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="unknown"
              checked={statusFilter === "unknown"}
              onChange={() => setStatusFilter("unknown")}
            />{" "}
            Unknown
          </label>
        </div>
      </div>

      {loading && <p>Loading Characters</p>} {/*if loading state is equal to true show a message that informs user that character data being fetched */}
      {error && <p>{error}</p>} {/*if error state is not null display the error so user knows something went wrong with fetching data */}


      {/* in no loading and no error occurred render the main content: the list of characters and pagination controls*/}
      {!loading && !error && (
        <>
          <ul className={styles.grid}>
            {characters.map((char) => (
              <li key={char.id} className={styles.card}> {/*Show character image and name, The key prop uses chair.id for unique identfication of each list item */}
                <img src={char.image} alt={char.name} />
                <div>
                  {/*Character name as heading with a tooltip (title attribute)*/}
                  <h2 title={char.name}>{char.name}</h2>

                  {/*Display character status */}
                  <p className={styles.characterInfo}>
                    Character status: {char.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          
          {/*Pagination buttons to navigate between pages */}
          <div className={styles.pagination}>
            {/*previous button:
              - Decreases page number by 1 but never below 1 
              - Disabled if there is no previous page
             */}
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!info?.prev}
            >
              Previous
            </button>
            

            {/*Displaying current page and total count of pages */}
            <span>
              You are currently on {page} / {info?.pages ?? "?"}
            </span>
            
            {/* 
              Next button :
              - Increases page number 1 if there is next page 
              - Disabled if there is no next page 
            */}
            <button
              onClick={() => setPage((prev) => (info?.next ? prev + 1 : prev))}
              disabled={!info?.next}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default RickAndMortyPaginatedList;
