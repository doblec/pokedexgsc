import { useState, useEffect } from 'react';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export function usePokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        // Fetch first 251 pokemon (Gen 1 & 2)
        const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=251`);
        const data = await response.json();
        
        // Map data for clean ID and Name
        const formattedList = data.results.map((p, index) => ({
          id: index + 1,
          name: p.name,
          url: p.url,
          caught: true 
        }));
        
        setPokemonList(formattedList);
      } catch (error) {
        console.error("Error fetching Pokemon list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  return { pokemonList, loading };
}

export function usePokemonDetails(id) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Parallel fetch for basic data and species
        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(`${POKEAPI_BASE}/pokemon/${id}`),
          fetch(`${POKEAPI_BASE}/pokemon-species/${id}`)
        ]);

        if (!isMounted) return;

        const pokemon = await pokemonRes.json();
        const species = await speciesRes.json();

        const findEntryText = (versionName) => {
          const entry = species.flavor_text_entries.find(
            e => e.language.name === 'en' && e.version.name === versionName
          );
          return entry ? entry.flavor_text.replace(/[\f\n]/g, ' ') : "";
        };

        const category = species.genera.find(g => g.language.name === 'en');

        const form = id === 201 ? '-a' : '';

        if (!isMounted) return;

        setDetails({
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height, // Decimeters
          weight: pokemon.weight, // Hectograms
          sprites: {
            normal: [
             `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/${id}${form}.png`,
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/${id}${form}.png`,
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/animated/${id}${form}.gif`
          ],
            shiny: [
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/shiny/${id}${form}.png`,
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/shiny/${id}${form}.png`,
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/animated/shiny/${id}${form}.gif`
            ]
          },
          descriptions: [
            findEntryText('gold'),
            findEntryText('silver'),
            findEntryText('crystal')
          ],
          category: category ? category.genus.replace(' Pokémon', '') : "Unknown",
          cry: pokemon.cries?.latest || pokemon.cries?.legacy
        });

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { details, loading };
}