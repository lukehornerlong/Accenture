import java.util.*;

public class Mapping {

    public static final int INITIAL_LOCATION = 95;

    /**
     * TODO
     * create a static LocationMap object
     */

    static LocationMap locationm = new LocationMap();


    /**
     * TODO
     * create a vocabulary HashMap to store all directions a user can go
     */
    Map<String, String> vocabulary = new LinkedHashMap<>();


    /**
     * TODO
     * create a FileLogger object
     */
    FileLogger FileL = new FileLogger();

    /**
     * TODO
     * create a ConsoleLogger object
     */
    ConsoleLogger consoleL = new ConsoleLogger();


    public Mapping() {
        //vocabulary.put("QUIT", "Q"); //example
        vocabulary.put("SOUTHEAST", "SE");
        vocabulary.put("SOUTHWEST", "SW");
        vocabulary.put("NORTHEAST", "NE");
        vocabulary.put("NORTHWEST", "NW");
        vocabulary.put("QUIT", "Q");
        vocabulary.put("SOUTH", "S");
        vocabulary.put("NORTH", "N");
        vocabulary.put("EAST", "E");
        vocabulary.put("WEST", "W");
        vocabulary.put("UP", "U");
        vocabulary.put("DOWN", "D");

        /** TODO
         * complete the vocabulary HashMap <Key, Value> with all directions.
         * use the directions.txt file and crosscheck with the ExpectedInput and ExpectedOutput files to find the keys and the values
         */
    }

    public void mapping() {

        /** TODO
         * create a Scanner object
         */
        Scanner sc = new Scanner(System.in);

        /**
         * initialise a location variable with the INITIAL_LOCATION
         */
        int currentlocation = INITIAL_LOCATION;

        while (true) {
            String userchoice = "";
            String keyer = "NOTHING";
            String desc = locationm.get(currentlocation).getDescription();
            int location = locationm.get(currentlocation).getLocationId();
            consoleL.log(desc);
            FileL.log(desc);
            if (currentlocation == 0) {
                FileL.log("\n");
                consoleL.log("\n");
                break;
            }
            /** TODO
             * get the location and print its description to both console and file
             * use the FileLogger and ConsoleLogger objects
             */
            /** TODO
             * verify if the location is exit
             */
            // System.out.printf(String.valueOf(locationm.size()));
            if (locationm.containsKey(currentlocation)) {
                Map holdermap = locationm.get(currentlocation).getExits();
                String outputholder = "Available exits are ";
                for (Object key : holdermap.keySet()) {
                    outputholder += (key.toString() + ", ");
                }


                consoleL.log("\n" + outputholder + "\n");
                FileL.log("\n" + outputholder + "\n");
                String userinput = sc.nextLine();
                userinput = userinput.toUpperCase(Locale.ROOT);
                userinput = " " + userinput;
                if (vocabulary.containsValue(userinput.trim())) {
                    userchoice = userinput.trim();
                    if (holdermap.containsKey(userchoice)) {
                        currentlocation = (int) holdermap.get(userchoice);
                    } else {
                        FileL.log("You cannot go in that direction\n");
                        consoleL.log("You cannot go in that direction\n");
                    }
                } else {
                    //System.out.printf("!!!!!!!!!!!!!!!!!!!!!!");
                    for (Object key : vocabulary.keySet()) {
                        //consoleL.log(key.toString());
                        if (userinput.indexOf(key.toString()) != -1) {
                            if (userinput.indexOf(key.toString()) > userinput.indexOf(keyer) && keyer.indexOf(key.toString()) == -1) {
                                if (userinput.charAt(userinput.indexOf(key.toString()) - 1) == ' ') {
                                    keyer = key.toString();

                                }

                            }


                        }

                    }
                    keyer = vocabulary.get(keyer);

                    if (holdermap.containsKey(keyer)) {
                        currentlocation = (int) holdermap.get(keyer);

                    } else {
                        FileL.log("You cannot go in that direction\n");
                        consoleL.log("You cannot go in that direction\n");
                    }

                }


            }


            /** TODO
             * input a direction
             * ensure that the input is converted to uppercase
             */

            /** TODO
             * are we dealing with a letter / word for the direction to go to?
             * available inputs are: a letter(the HashMap value), a word (the HashMap key), a string of words that contains the key
             * crosscheck with the ExpectedInput and ExpectedOutput files for examples of inputs
             * if the input contains multiple words, extract each word
             * find the direction to go to using the vocabulary mapping
             * if multiple viable directions are specified in the input, choose the last one
             */

            /** TODO
             * if user can go in that direction, then set the location to that direction
             * otherwise print an error message (to both console and file)
             * check the ExpectedOutput files
             */
        }
    }

    public static void main(String[] args) {
        /**TODO
         * run the program from here
         * create a Mapping object
         * start the game
         */
        Mapping mapin = new Mapping();
        mapin.mapping();

    }

}
