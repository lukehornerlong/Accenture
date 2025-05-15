import java.io.*;
import java.util.*;

//class that behaves like a map
public class LocationMap implements Map<Integer, Location> {


    private static final String LOCATIONS_FILE_NAME = "locations.txt";
    private static final String DIRECTIONS_FILE_NAME = "directions.txt";

    /**
     * TODO
     * create a static locations HashMap
     */
    static HashMap<Integer, Location> locations = new LinkedHashMap<>();

    static {
        /** TODO
         * create a FileLogger object
         */
        FileLogger FileL = new FileLogger();


        /** TODO
         * create a ConsoleLogger object
         */
        ConsoleLogger ConsoleL = new ConsoleLogger();
        ConsoleL.log("Available locations:\n");
        FileL.log("Available locations:\n");

        try {
            FileReader FR = new FileReader(LOCATIONS_FILE_NAME);
            BufferedReader BR = new BufferedReader(FR);
            String currentline = "";
            while (currentline != null) {

                String description = "";
                String location = "";
                Boolean movedpassedcomma = false;
                currentline = BR.readLine();
                int firstcomma = 0;
                if (currentline != null) {
                    for (int i = 0; i < currentline.length(); i++) {
                        if ((currentline.charAt(i) != ',') && (movedpassedcomma == false)) {
                            location = location + currentline.charAt(i);
                        } else {
                            if (movedpassedcomma == false) {
                                firstcomma = i;

                            }
                            movedpassedcomma = true;
                            if (currentline.charAt(i) != ',' || i > firstcomma) {
                                description = description + currentline.charAt(i);

                            }


                        }
                    }
                    locations.put(Integer.valueOf(location), new Location(Integer.valueOf(location), description, Collections.emptyMap()));
                    ConsoleL.log(location + ": " + description + "\n");
                    FileL.log(location + ": " + description + "\n");

                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        FileReader FR = null;
        try {
            FR = new FileReader(DIRECTIONS_FILE_NAME);
            BufferedReader BR = new BufferedReader(FR);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        ConsoleL.log("Available directions:\n");
        FileL.log("Available directions:\n");

        try {
            FileReader FRtwo = new FileReader(DIRECTIONS_FILE_NAME);
            BufferedReader BRtwo = new BufferedReader(FRtwo);
            String currentline = "NOTHING";

            while (currentline != null) {
                String CurrentLocation = "";
                String DirectionOfLocation = "";
                String CurrentDestination = "";
                currentline = BRtwo.readLine();
                int counter = 0;
                int CurrentSetting = 0; //this roates between location direction and desination after each comma
                if (currentline != null) {
                    int i = currentline.length();

                    do {
                        if (currentline.charAt(counter) == ',') {
                            CurrentSetting += 1;
                        } else {

                            switch (CurrentSetting) {
                                case 0:
                                    CurrentLocation += currentline.charAt(counter);
                                    break;
                                case 1:
                                    DirectionOfLocation += currentline.charAt(counter);
                                    break;
                                case 2:
                                    CurrentDestination += currentline.charAt(counter);
                                    break;
                                default:

                            }
                        }
                        counter += 1;

                    } while (counter != i);
                    locations.get(Integer.valueOf(CurrentLocation)).addExit(DirectionOfLocation, Integer.valueOf(CurrentDestination));
                    ConsoleL.log(CurrentLocation + ": " + DirectionOfLocation + ": " + CurrentDestination + "\n");
                    FileL.log(CurrentLocation + ": " + DirectionOfLocation + ": " + CurrentDestination + "\n");
                }

            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /** TODO
     * Read from LOCATIONS_FILE_NAME so that a user can navigate from one location to another
     * use try-with-resources/catch block for the FileReader
     * extract the location and the description on each line
     * print all locations and descriptions to both console and file
     * check the ExpectedOutput files
     * put the location and a new Location object in the locations HashMap, using temporary empty hashmaps for exits
     */

    /**TODO
     * Read from DIRECTIONS_FILE_NAME so that a user can move from A to B, i.e. current location to next location
     * use try-with-resources/catch block for the FileReader
     * extract the 3 elements  on each line: location, direction, destination
     * print all locations, directions and destinations to both console and file
     * check the ExpectedOutput files
     * add the exits for each location
     */


    /**
     * TODO
     * implement all methods for Map
     *
     * @return
     */
    @Override
    public int size() {
        //TODO
        return locations.size();
    }

    @Override
    public boolean isEmpty() {
        //TODO
        return locations.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        //TODO
        return locations.containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        //TODO
        return locations.containsValue(value);
    }

    @Override
    public Location get(Object key) {
        //TODO
        return locations.get(key);
    }

    @Override
    public Location put(Integer key, Location value) {
        //TODO
        return locations.put(key, value);
    }

    @Override
    public Location remove(Object key) {
        //TODO
        return locations.remove(key);
    }

    @Override
    public void putAll(Map<? extends Integer, ? extends Location> m) {
        //TODO
        locations.putAll(m);
    }

    @Override
    public void clear() {
        //TODO
        locations.clear();
    }

    @Override
    public Set<Integer> keySet() {
        //TODO
        return locations.keySet();
    }

    @Override
    public Collection<Location> values() {
        //TODO
        return locations.values();
    }

    @Override
    public Set<Entry<Integer, Location>> entrySet() {
        //TODO
        return locations.entrySet();
    }
}
