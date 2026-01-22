import {
    faLocationCrosshairs,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState } from "react";

interface LocalizationProps {
  onLocationSelect?: (location: LocationData) => void;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface LocalizationRef {
  openLocationDialog: () => void;
}

const Localization = forwardRef<LocalizationRef, LocalizationProps>(
  ({ onLocationSelect }, ref) => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useImperativeHandle(ref, () => ({
      openLocationDialog: () => {
        setShowDialog(true);
      },
    }));

    // Obtenir la position actuelle de l'utilisateur
    const getCurrentLocation = () => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setError("La géolocalisation n'est pas supportée par votre navigateur");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Récupérer l'adresse via reverse geocoding
          try {
            const address = await reverseGeocode(
              locationData.latitude,
              locationData.longitude,
            );
            locationData.address = address.display_name;
            locationData.city = address.city || address.town || address.village;
            locationData.country = address.country;
          } catch (err) {
            console.error("Erreur lors de la récupération de l'adresse:", err);
          }

          setLocation(locationData);
          setIsLoading(false);

          if (onLocationSelect) {
            onLocationSelect(locationData);
          }
        },
        (error) => {
          setError(
            "Impossible d'obtenir votre position. Veuillez vérifier les permissions.",
          );
          setIsLoading(false);
          console.error("Erreur de géolocalisation:", error);
        },
      );
    };

    // Reverse geocoding avec OpenStreetMap Nominatim (gratuit)
    const reverseGeocode = async (lat: number, lon: number) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération de l'adresse");
      return response.json();
    };

    // Recherche de suggestions en temps réel
    const fetchSuggestions = async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        );

        if (!response.ok) return;

        const results = await response.json();
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Erreur lors de la récupération des suggestions:", err);
      }
    };

    // Gérer le changement de saisie
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      fetchSuggestions(value);
    };

    // Sélectionner une suggestion
    const selectSuggestion = (suggestion: any) => {
      const locationData: LocationData = {
        latitude: parseFloat(suggestion.lat),
        longitude: parseFloat(suggestion.lon),
        address: suggestion.display_name,
        city:
          suggestion.address?.city ||
          suggestion.address?.town ||
          suggestion.address?.village,
        country: suggestion.address?.country,
      };

      setLocation(locationData);
      setSearchQuery(suggestion.display_name);
      setShowSuggestions(false);
      setSuggestions([]);

      if (onLocationSelect) {
        onLocationSelect(locationData);
      }
    };

    // Recherche d'adresse
    const searchLocation = async () => {
      if (!searchQuery.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        );

        if (!response.ok) throw new Error("Erreur lors de la recherche");

        const results = await response.json();

        if (results.length === 0) {
          setError("Aucune localisation trouvée");
          setIsLoading(false);
          return;
        }

        const result = results[0];
        const locationData: LocationData = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name,
          city: result.address?.city || result.address?.town,
          country: result.address?.country,
        };

        setLocation(locationData);
        setIsLoading(false);

        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      } catch (err) {
        setError("Erreur lors de la recherche de localisation");
        setIsLoading(false);
        console.error("Erreur de recherche:", err);
      }
    };

    const handleRemove = () => {
      setLocation(null);
      setSearchQuery("");
      setError(null);
      setSuggestions([]);
      setShowSuggestions(false);
    };

    if (!showDialog) return null;

    return (
      <div className="localization-container flex flex-col gap-4 w-full p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Ajouter une localisation
          </label>

          {/* Recherche d'adresse avec autocomplétion */}
          <div className="flex gap-2 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher une adresse..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Liste de suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">📍</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {suggestion.address?.city ||
                              suggestion.address?.town ||
                              suggestion.address?.village ||
                              suggestion.name}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {suggestion.display_name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={searchLocation}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {/* Bouton position actuelle */}
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
          >
            <FontAwesomeIcon icon={faLocationCrosshairs} />
            {isLoading ? "Chargement..." : "Utiliser ma position actuelle"}
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Affichage de la localisation sélectionnée */}
        {location && (
          <div className="mt-2 p-4 bg-white border-2 border-green-500 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  📍 Localisation sélectionnée
                </p>
                <p className="text-sm text-gray-600">
                  {location.address ||
                    `${location.latitude}, ${location.longitude}`}
                </p>
                {location.city && (
                  <p className="text-xs text-gray-500 mt-1">
                    {location.city}, {location.country}
                  </p>
                )}
              </div>
              <button
                onClick={handleRemove}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Localization.displayName = "Localization";

export default Localization;
