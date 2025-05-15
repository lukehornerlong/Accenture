import java.sql.*;

public class Database {

    //This method executes a query and returns the number of albums for the artist with name artistName
    public int getTitles(String artistName) {
        artistName.replaceAll("[^A-Za-z' ]", ""); // removes everything thats not spaces or alphabet to help prevent sql injection
        int titleNum = 0;

        try {
            Class.forName("org.postgresql.Driver");
            Connection dbCon = DriverManager.getConnection(Credentials.URL,
                    Credentials.USERNAME,
                    Credentials.PASSWORD);
//this prevents the sql injection
            String sqlStatement = "SELECT COUNT(title) FROM album WHERE artistID=(SELECT artistid FROM artist WHERE name=?)";
            PreparedStatement statement = dbCon.prepareStatement(sqlStatement);

            statement.setString(1, artistName);
            statement.executeQuery();
            ResultSet resultSet = statement.getResultSet();

            if (resultSet.next()) {
                titleNum = resultSet.getInt("count");
            }

            resultSet.close();
            statement.close();
            dbCon.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return titleNum;
    }

    // This method establishes a DB connection & returns a boolean status
    public boolean establishDBConnection() {
        try {
            Class.forName("org.postgresql.Driver");

            Connection dbCon = DriverManager.getConnection(Credentials.URL, Credentials.USERNAME, Credentials.PASSWORD);

            return dbCon.isValid(5);

        } catch (SQLException e) {
        } catch (ClassNotFoundException e) {
        }
        //Implement this method
        //5 sec timeout
        return false;
    }
}