import java.util.Arrays;

public class BingoCard {
    private int[][] numbers;
    private boolean[][] markedOff;

    private int numberOfRows;
    private int numberOfColumns;

    public BingoCard(int numberOfRows, int numberOfColumns) {
        setNumberOfRows(numberOfRows);
        setNumberOfColumns(numberOfColumns);

        numbers = new int[numberOfColumns][numberOfRows];
        markedOff = new boolean[numberOfColumns][numberOfRows];
        resetMarked();
    }

    public void resetMarked() {
        for (int i = 0; i <= numberOfRows - 1; i++) {
            for (int y = 0; y <= numberOfColumns - 1; y++) {
                markedOff[y][i] = false;
            }
        }

    }

    public int getNumberOfRows() {

        return numberOfRows;
    }

    public void setNumberOfRows(int newnumberofrows) {
        numberOfRows = newnumberofrows;
    }

    public int getNumberOfColumns() {

        return numberOfColumns;
    }

    public void setNumberOfColumns(int newnumberofcolumns) {
        numberOfColumns = newnumberofcolumns;
    }

    public String getCardNumbers() {

        StringBuilder sb = new StringBuilder();

        int current = 0;

        for (int row = 0; row < numberOfRows; row++) {
            for (int col = 0; col < numberOfColumns; col++) {
                current = numbers[col][row];
                if (Integer.toString(current).length() == 2) {
                    sb.append(Integer.toString(numbers[col][row]));
                } else {
                    sb.append(" " + Integer.toString(numbers[col][row]));
                }
                if (col != numberOfColumns - 1) {
                    sb.append(Defaults.getNumberSeparator());
                } else {
                    sb.append("\n");
                }
            }
        }
        return sb.toString();
    }

    public void setCardNumbers(String[] numbersAsStrings) {
        int[] numbersList =
                Arrays.stream(numbersAsStrings).mapToInt(Integer::parseInt).toArray();
        int counter = 0;
        for (int i = 0; i <= numberOfRows - 1; i++) {
            for (int y = 0; y <= numberOfColumns - 1; y++) {
                numbers[y][i] = numbersList[counter];
                counter += 1;
            }
        }
    }

    public void markNumber(int number) {
        boolean found = false;
        for (int i = 0; i <= numberOfRows - 1; i++) {
            for (int p = 0; p <= numberOfColumns - 1; p++) {
                if (numbers[p][i] == number) {
                    markedOff[p][i] = true;
                    System.out.printf("Marked off " + Integer.toString(number) + "%n");
                    found = true;
                }
            }
        }
        if (found == false) {
            System.out.printf("Number " + Integer.toString(number) + " not on this card%n");
        }

    }

    public boolean isWinner() {
        int totaltrues = 0;
        for (int i = 0; i <= numberOfRows - 1; i++) {
            for (int p = 0; p <= numberOfColumns - 1; p++) {
                if (markedOff[p][i] == true) {
                    totaltrues += 1;
                }
            }
        }
        if (totaltrues == numberOfColumns * numberOfRows) {
            return true;
        } else {
            return false;
        }
    }
}