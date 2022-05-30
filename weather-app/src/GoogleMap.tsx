// [START maps_react_map]
import * as React from "react";
import * as ReactDom from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { isConstructorDeclaration, setOriginalNode } from "typescript";
import { setMaxListeners } from "process";
import { useEffect } from "react";
import { map } from "jquery";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const GoogleMap = (props: any) => {
  // [START maps_react_map_component_app_state]

  const [zoom, setZoom] = React.useState(6); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  useEffect(() => {
    setCenter({
      lat: parseFloat(props.lat),
      lng: parseFloat(props.lon),
    });
  }, [props]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    console.log("e.latLng!: ", e.latLng && e.latLng.lng());
    console.log("e.latLng!: ", e.latLng && e.latLng.lat());
    if (e.latLng) {
      props.setLat(e.latLng.lat().toString());
      props.setLon(e.latLng.lng().toString());

      localStorage.clear();
      props.setClicks([...props.clicks, e.latLng]); // spread operator
      props.updateData(e.latLng.lat().toString(), e.latLng.lng().toString());
    }
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  return (
    <div>
      <div>
        {" "}
        <input
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          type="range"
          id="vol"
          name="vol"
          min={1}
          max={15}
        />
      </div>
      <div className="harita">
        <div style={{ display: "flex", height: "500px", width: "500px" }}>
          {/* <input
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          type="range"
          id="vol"
          name="vol"
          min={1}
          max={15}
        /> */}
          <Wrapper
            apiKey={"AIzaSyCfy-kvoje4j91sQ_ARMpol5sZa7j8XatE"}
            render={render}
          >
            <Map
              center={center}
              onClick={onClick}
              onIdle={onIdle}
              zoom={zoom}
              style={{ flexGrow: "1", height: "100%" }}
            >
              <Marker
                position={{
                  lat: parseFloat(props.lat),
                  lng: parseFloat(props.lon),
                }}
              />
            </Map>
          </Wrapper>
        </div>
      </div>
    </div>
  );
  // [END maps_react_map_component_app_return]
};
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  // [START maps_react_map_component_add_map_hooks]
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);
  // [END maps_react_map_component_add_map_hooks]

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);
  // [END maps_react_map_component_options_hook]

  // [START maps_react_map_component_event_hooks]
  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);
  // [END maps_react_map_component_event_hooks]

  // [START maps_react_map_component_return]
  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
  // [END maps_react_map_component_return]
};

// [START maps_react_map_marker_component]
const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};
// [END maps_react_map_marker_component]

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default GoogleMap;
