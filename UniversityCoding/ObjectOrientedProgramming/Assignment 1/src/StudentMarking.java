import java.util.Locale;
import java.util.Scanner;
// DO NOT import anything else

/**
 * This class forms Java Assignment 1, 2021
 */
public class StudentMarking {


    public final String MENU_TEMPLATE =
            "%nWelcome to the Student System. Please enter an option 0 to 3%n"
                    + "0. Exit%n"
                    + "1. Generate a student ID%n"
                    + "2. Capture marks for students%n"
                    + "3. List student IDs and average mark%n";

    public final String NOT_FOUND_TEMPLATE =
            "No student id of %s exists";


    // TODO (All questions) - Complete these templates which will be used throughout the program
    public int totalstudents = 0;

    public final String ENTER_MARK_TEMPLATE =
            "Please enter mark %d for student %s";
    public final String STUDENT_ID_TEMPLATE =
            "Your studID is %s%n";
    public final String NAME_RESPONSE_TEMPLATE =
            "you entered a given name of %s and a surname of %s%n";
    public final String LOW_HIGH_TEMPLATE =
            "Student %s has a lowest mark of %d and a highest mark of %d%n";
    public final String AVG_MARKS_TEMPLATE =
            "Student ***%s*** has an average of %.2f%n";

    /**
     * Creates a student ID based on user input
     *
     * @param //sc Scanner reading {@link System#in} re-used from {@link StudentMarking#main(String[])}
     * @return a studentID according to the pattern specified in {@link StudentMarking#STUDENT_ID_TEMPLATE}
     */
    public int gettotalstudent() {
        return totalstudents;
    }

    public void addonetototalstudents() {
        totalstudents = totalstudents + 1;
    }

    public String generateStudId(Scanner sc, String fullname) {
        // TODO (3.4) - Complete the generateStudId method which will allow a user to generate a student id
        String studId = "generateStudId is incomplete"; // TODO Don't have unnecessary initialisations
        String firstname = "";
        String surname = "";

        String[] differentparts = fullname.split(" ");
        firstname = differentparts[0];
        surname = differentparts[1];
        System.out.printf(NAME_RESPONSE_TEMPLATE, firstname, surname);
        studId = "";
        studId = (studId + firstname.charAt(0) + surname.charAt(0));
        studId = studId.toUpperCase(Locale.ROOT);
        if (surname.length() / 2 < 5) {
            studId = studId + "0" + surname.length();

        } else {
            studId = studId + (surname.length());

        }
        int len = firstname.length();
        int middle = len / 2;
        studId = studId + firstname.charAt(middle);
        len = surname.length();
        middle = len / 2;
        studId = studId + surname.charAt(middle);
        System.out.printf(STUDENT_ID_TEMPLATE, studId);

        return studId;
    }

    /**
     * Reads three marks (restricted to a floor and ceiling) for a student and returns their mean
     *
     * @param sc     Scanner reading {@link System#in} re-used from {@link StudentMarking#main(String[])}
     * @param studId a well-formed ID created by {@link StudentMarking#//generateStudId(Scanner)}
     * @return the mean of the three marks entered for the student
     **/
    public double captureMarks(Scanner sc, String studId, String fullname) {
        //System.out.printf("made it");
        // TODO (3.5) - Complete the captureMarks method which will allow a user to input three mark for a chosen student
        // DO NOT change MAX_MARK and MIN_MARK
        boolean valid = false;
        int[] markholder = new int[3];
        int total = 0;
        final int MAX_MARK = 100;
        final int MIN_MARK = 0;
        for (int i = 0; i <= 2; i++) {
            valid = false;
            while (valid == false) {
                System.out.printf(ENTER_MARK_TEMPLATE, i + 1, fullname);
                markholder[i] = sc.nextInt();
                sc.nextLine();
                //System.out.print(markholder[i]);

                if (markholder[i] > MIN_MARK && markholder[i] < MAX_MARK) {
                    valid = true;
                    total = total + markholder[i];
                } else {
                    System.out.printf("that is not a valid mark please try again");

                }
            }

        }

        double avg;
        avg = total / 3;
        System.out.printf("Would you like to print a bar chart? [y/n]%n");
        String holdingdescision = sc.nextLine();
        int downscaler = 0;
        //System.out.printf(holdingdescision);
        if (holdingdescision.equals("y")) {
            //System.out.printf("hello");
            for (int i = 0; i <= 2; i++) {
                downscaler = markholder[i];
                System.out.print(downscaler);
                for (int y = 0; y < downscaler; y++) {
                    System.out.printf("*");
                }
                System.out.printf("\n");
            }

        }
        return avg;
    }

    /**
     * outputs a simple character-based vertical bar chart with 2 columns
     *
     * @param studId a well-formed ID created by {@link StudentMarking#//generateStudId(Scanner)}
     * @param high   a student's highest mark
     * @param low    a student's lowest mark
     */
    public void printBarChart(String studId, int high, int low) {
        // TODO (3.6) - Complete the printBarChart method which will print a bar chart of the highest and lowest results of a student
        System.out.printf("Student id statistics: %s%n", studId);

    }

    /**
     * Prints a specially formatted report, one line per student
     *
     * @param //studList student IDs originally generated by {@link StudentMarking#//generateStudId(Scanner)}
     * @param count      the total number of students in the system
     * @param avgArray   mean (average) marks
     */
    public void reportPerStud(String[] keepids,
                              int count,
                              double[] avgArray) {
        // TODO (3.7) - Complete the reportPerStud method which will print all student IDs and average marks
        do {
            System.out.printf("| " + keepids[count] + " | " + avgArray[count] + " |%n");
            count += 1;
        } while (keepids[count] != null);

    }

    /**
     * The main menu
     */
    public void displayMenu() {
        System.out.printf(MENU_TEMPLATE);
    }

    /**
     * The controlling logic of the program. Creates and re-uses a {@link Scanner} that reads from {@link System#in}.
     *
     * @param args Command-line parameters (ignored)
     */
    public static void main(String[] args) {
        // TODO (3.3) - Complete the main method to give the program its core
        // DO NOT change sc, sm, EXIT_CODE, and MAX_STUDENTS
        Integer currentstudent = 0;
        Scanner sc = new Scanner(System.in);

        StudentMarking sm = new StudentMarking();
        final int EXIT_CODE = 0;
        final int MAX_STUDENTS = 5;
        int holder = 0;
        // TODO Initialise these
        String[] keepStudId = new String[99];
        double[] avgArray = new double[99];
        String[] fullnames = new String[99];
        // TODO Build a loop around displaying the menu and reading then processing input
        boolean exiter = false;
        String fullname = "";
        while (exiter == false) {
            holder = 0;


            sm.displayMenu();

            //System.out.printf(ENTER_STUDID);
            try {
                //System.out.printf("at least its trying");
                holder = sc.nextInt();
                sc.nextLine();
                if (holder == 1) {
//System.out.printf("1");
                    System.out.printf(
                            "Please enter your given name and surname (Enter 0 to return to main menu)%n");

                    fullname = sc.nextLine();
                    if (fullname != "0") {
                        sm.addonetototalstudents();

                        keepStudId[sm.gettotalstudent() - 1] = sm.generateStudId(sc, fullname);
                        fullnames[sm.gettotalstudent() - 1] = fullname;
                    }

                } else if (holder == 2) {
                    String studholder = "";
                    System.out.printf("Please enter the studId to capture their marks (Enter 0 to return to main menu)%n");
                    studholder = sc.nextLine();
                    //  System.out.printf(studholder);
                    for (int i = 0; i < keepStudId.length - 1; i++) {
                        //System.out.printf(keepStudId[i]);
                        if (keepStudId[i].equals(studholder)) {

                            currentstudent = i;
                            break;
                        }


                    }
                    //System.out.printf(fullnames[currentstudent]);
                    avgArray[currentstudent] = sm.captureMarks(sc, keepStudId[currentstudent], fullnames[currentstudent]);
                } else if (holder == 3) {
                    System.out.printf("3");
                    sm.reportPerStud(keepStudId, 0, avgArray);
                } else if (holder == 0) {
                    System.out.printf("Goodbye%n");
                    break;
                } else {
                    System.out.printf(
                            "You have entered an invalid option. Enter 0, 1, 2 or 3%n");// Skeleton: keep, unchanged
                    //  exiter = false;
                    continue;
                }
            } catch (Exception e) {
                System.out.printf(
                        "You have encountered a problem please try again%n");// Skeleton: keep, unchanged
                //exiter = false;

            }


        }


    }
}

/*
    TODO Before you submit:
         1. ensure your code compiles
         2. ensure your code does not print anything it is not supposed to
         3. ensure your code has not changed any of the class or method signatures from the skeleton code
         4. check the Problems tab for the specific types of problems listed in the assignment document
         5. reformat your code: Code > Reformat Code
         6. ensure your code still compiles (yes, again)
 */