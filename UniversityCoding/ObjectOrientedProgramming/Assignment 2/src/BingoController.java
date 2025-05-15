import java.util.ArrayList;
import java.util.Arrays;

import static java.lang.Integer.parseInt;

public class BingoController {

    private final String[] mainMenuItems = {"Exit",
            "Play bingo",
            "Set number separator",
            "Create a bingo card",
            "List existing cards",
            "Set bingo card size"};

    private final String OPTION_EXIT = " 0: ";
    private final String OPTION_PLAY = " 1: ";
    private final String OPTION_SEPARATOR = " 2: ";
    private final String OPTION_CREATE_CARD = " 3: ";
    private final String OPTION_LIST_CARDS = " 4: ";
    private final String OPTION_SIZE = " 5: ";
    private int currentRowSize = 4;
    private int currentColumnSize = 4;
    private int currentamountofcards = 0;

    BingoCard[] bingoCardArray = new BingoCard[99];

    public int getCurrentRowSize() {

        return currentRowSize;
    }

    public void setCurrentRowSize(int rows) {
        currentRowSize = rows;
    }

    public int getCurrentColumnSize() {

        return currentColumnSize;
    }

    public void setCurrentColumnSize(int columnSize) {
        currentColumnSize = columnSize;
    }

    public void addNewCard(BingoCard card) {
        /*
            haven't really had to use this and it would be impractical to use so i've just left it blank
         */
    }

    public void setSize() {
        String holderrowsize = Toolkit.getInputForMessage("Enter the number of rows for the card");
        setCurrentRowSize(Integer.parseInt(holderrowsize.trim()));
        String holdercollumnsize = Toolkit.getInputForMessage("Enter the number of columns for the card");
        setCurrentColumnSize(Integer.parseInt(holdercollumnsize.trim()));
        System.out.printf("The bingo card size is set to %d rows X %d columns%n",
                getCurrentRowSize(),
                getCurrentColumnSize());
    }

    public void createCard() {
        int numbersRequired = (getCurrentRowSize() * getCurrentColumnSize());

        String[] numbers;

        boolean correctAmountOfNumbersEntered = false;

        do {
            numbers = Toolkit.getInputForMessage(
                            String.format(
                                    "Enter %d numbers for your card (separated by " +
                                            "'%s')",
                                    numbersRequired,
                                    Defaults.getNumberSeparator()))
                    .trim()
                    .split(Defaults.getNumberSeparator());
            if (numbers.length == numbersRequired) {
                correctAmountOfNumbersEntered = true;
            } else {
                correctAmountOfNumbersEntered = false;
                System.out.printf("Try again: you entered %d numbers instead of %d%n", numbers.length, numbersRequired);
            }
        } while (!correctAmountOfNumbersEntered);
        System.out.printf("You entered%n");

        System.out.printf(Toolkit.printArray(numbers));
        System.out.println();
        BingoCard newBingoCard = new BingoCard(getCurrentRowSize(), getCurrentColumnSize());
        newBingoCard.setCardNumbers(numbers);
        bingoCardArray[currentamountofcards] = newBingoCard;
        currentamountofcards += 1;
    }

    public void listCards() {
        for (int i = 0; i <= currentamountofcards - 1; i++) {
            System.out.printf("Card  %s numbers:%n", i);

            printCardAsGrid(bingoCardArray[i].getCardNumbers());
        }

    }

    public void printCardAsGrid(String numbers) {
        //insert code here to print numbers as a grid
        System.out.printf(numbers);
    }

    public void setSeparator() {
        String sep = Toolkit.getInputForMessage("Enter the new separator");
        Defaults.setNumberSeparator(sep);
        System.out.printf("Separator is '%s'%n", Defaults.getNumberSeparator());
    }

    public void resetAllCards() {
        //insert code here
        for (int i = 0; i < currentamountofcards - 1; i++) {
            bingoCardArray[i].resetMarked();
        }
    }

    public void markNumbers(int number) {
        for (int i = 0; i < currentamountofcards; i++) {
            System.out.printf("Checking card %s for %s%n", i, number);

            bingoCardArray[i].markNumber(number);
        }
    }

    public int getWinnerId() {
        boolean winnerholder = false;
        for (int i = 0; i < currentamountofcards; i++) {
            winnerholder = bingoCardArray[i].isWinner();
            if (winnerholder == true) {
                return i;
            }
        }
        return -1;
    }

    public void play() {
        System.out.println("Eyes down, look in!");
        resetAllCards();
        boolean weHaveAWinner = false;
        do {
            markNumbers(parseInt(
                    Toolkit.getInputForMessage("Enter the next number")
                            .trim()));
            int winnerID = getWinnerId();
            weHaveAWinner = winnerID != Defaults.NO_WINNER;
            if (weHaveAWinner)
                System.out.printf("And the winner is card %d%n", winnerID);
        } while (!weHaveAWinner);
    }

    public String getMenu(String[] menuItems) {

        String newline = "\n";
        StringBuilder menuText = new StringBuilder();

        menuText.append(OPTION_EXIT);
        menuText.append(menuItems[0]);
        menuText.append(newline);

        menuText.append(OPTION_PLAY);
        menuText.append(menuItems[1]);
        menuText.append(newline);

        menuText.append(OPTION_SEPARATOR);
        menuText.append(menuItems[2]);
        menuText.append(newline);

        menuText.append(OPTION_CREATE_CARD);
        menuText.append(menuItems[3]);
        menuText.append(newline);

        menuText.append(OPTION_LIST_CARDS);
        menuText.append(menuItems[4]);
        menuText.append(newline);

        menuText.append(OPTION_SIZE);
        menuText.append(menuItems[5]);

        menuText.append("\n");
        return menuText.toString();
    }

    public void run() {
        getMenu(mainMenuItems);
        boolean finished = false;
        do {
            switch (Toolkit.getInputForMessage(getMenu(mainMenuItems))) {
                case "0":
                    finished = true;
                    break;
                case "1":
                    play();
                    break;
                case "2":
                    setSeparator();
                    break;
                case "3":
                    createCard();
                    break;
                case "4":
                    listCards();
                    break;
                case "5":
                    setSize();
                    break;
                default:


            }
        } while (!finished);
    }
}
