import { createContext, useState, useEffect } from "react";

export const locationContext = createContext();

function LocationContext({ children }) {
  const [currentLocation, setCurrentLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("lastKnownLocation");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });
  const [locationPermission, setLocationPermission] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("lastKnownLocation");
      if (cached) return "granted";
    }
    return "prompt";
  });

  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        if (typeof window !== "undefined" && navigator.permissions) {
          const result = await navigator.permissions.query({ name: "geolocation" });
          setLocationPermission(result.state);

          // Auto-fetch if already granted
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                setCurrentLocation(coords);
                localStorage.setItem("lastKnownLocation", JSON.stringify(coords));
              },
              (error) => {
                console.error("Error getting location automatically:", error);
              },
              { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
            );
          } else {
            setCurrentLocation(null);
            localStorage.removeItem("lastKnownLocation");
          }

          // Keep status updated if user toggles permissions in site settings
          result.onchange = () => {
            setLocationPermission(result.state);
            if (result.state === "granted") {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  setCurrentLocation(coords);
                  localStorage.setItem("lastKnownLocation", JSON.stringify(coords));
                },
                (error) => {
                  console.error("Error updating location on change:", error);
                },
                { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
              );
            } else if (result.state === "denied") {
              setCurrentLocation(null);
              localStorage.removeItem("lastKnownLocation");
            }
          };
        } else {
          // Fallback if navigator.permissions.query is not supported (e.g. Safari)
          const cached = localStorage.getItem("lastKnownLocation");
          if (cached) {
            setLocationPermission("granted");
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                setCurrentLocation(coords);
                localStorage.setItem("lastKnownLocation", JSON.stringify(coords));
              },
              () => {
                setCurrentLocation(null);
                setLocationPermission("prompt");
                localStorage.removeItem("lastKnownLocation");
              },
              { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
            );
          } else {
            setLocationPermission("prompt");
          }
        }
      } catch (err) {
        console.warn("navigator.permissions.query for geolocation is not fully supported:", err);
        const cached = localStorage.getItem("lastKnownLocation");
        if (cached) {
          setLocationPermission("granted");
        } else {
          setLocationPermission("prompt");
        }
      }
    };

    checkPermissionStatus();
  }, []);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationPermission("denied");
        reject(new Error("Geolocation not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(coords);
          setLocationPermission("granted");
          localStorage.setItem("lastKnownLocation", JSON.stringify(coords));
          resolve(coords);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermission("denied");
            setCurrentLocation(null);
            localStorage.removeItem("lastKnownLocation");
          } else {
            // It's a timeout or position unavailable error, not a permission denial.
            // Try to resolve using last known location if possible
            const cached = localStorage.getItem("lastKnownLocation");
            if (cached) {
              try {
                const coords = JSON.parse(cached);
                setCurrentLocation(coords);
                setLocationPermission("granted");
                resolve(coords);
                return;
              } catch (e) {}
            }
          }
          reject(error);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    });
  };

  return (
    <locationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        locationPermission,
        setLocationPermission,
        requestLocation,
      }}
    >
      {children}
    </locationContext.Provider>
  );
}

export default LocationContext;
