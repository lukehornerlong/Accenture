package fsd.assignment.assignment1;

import fsd.assignment.assignment1.datamodel.Student;
import fsd.assignment.assignment1.datamodel.StudentData;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.SortedList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import javafx.util.Callback;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class Controller {

    //these variables correspond to the <top> of main-view.fxml
    @FXML
    private TextField studId;

    @FXML
    private TextField yearStudy;

    @FXML
    private ChoiceBox<String> mod1Choice;

    @FXML
    private ChoiceBox<String> mod2Choice;

    @FXML
    private ChoiceBox<String> mod3Choice;

    private String choice1, choice2, choice3;

    private String modChoices[] = {"OOP", "Data Algo", "DS", "Maths", "AI",
            "Adv Programming", "Project"};

    @FXML
    private Label validateStudent; //remember this is the Label that you only see when there is an invalid "add"

    //validateStudent is the last element corresponding to <top>

    //these variables correspond to the <left> i.e. the studentListView
    @FXML
    private ListView<Student> studentListView;

    //these variables correspond to the <bottom> part of the border
    @FXML
    private Label yearStudyView;

    @FXML
    private Label mod1View;

    @FXML
    private Label mod2View;

    @FXML
    private Label mod3View;

    //mod3View is the last element for the bottom part of the border

    //the contextMenu is used for the right-click regarding Edit / Delete
    @FXML
    private ContextMenu listContextMenu;

    //this variable is used when switching windows from add to edit
    @FXML
    private BorderPane mainWindow;

    //used to add a student to the ArrayList for addStudentData()
    public Student studentToAdd;


    public void initialize() {

        studentListView.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<Student>() {
            @Override
            public void changed(ObservableValue<? extends Student> observable, Student oldValue, Student newValue) {


                if (newValue != null) {
                    yearStudyView.setText(newValue.GetYearOfStudy());
                    mod1View.setText(newValue.GetModule1());
                    mod2View.setText(newValue.GetModule2());
                    mod3View.setText(newValue.GetModule3());

                }

            }
        });
        //the setOnAction ensures that when a ChoiceBox is selected the getChoice() grabs the selected choice
        mod1Choice.setOnAction(this::getChoice);
        mod2Choice.setOnAction(this::getChoice);
        mod3Choice.setOnAction(this::getChoice);


        //insert the code to addAll() the modChoices [] to each ChoiceBox here

        for (int i = 0; i <= 6; i++) {
            mod1Choice.getItems().add(modChoices[i]);
            mod2Choice.getItems().add(modChoices[i]);
            mod3Choice.getItems().add(modChoices[i]);


        }
        ;


        //deleting a student

        listContextMenu = new ContextMenu();

        MenuItem deleteStudent = new MenuItem("Delete?");

        deleteStudent.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {


                deleteStudent(studentListView.getSelectionModel().getSelectedItem());
            }
        });

        //editing a student

        listContextMenu = new ContextMenu();


        MenuItem editStudent = new MenuItem("Edit?");

        editStudent.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {

                editStudent(studentListView.getSelectionModel().getSelectedItem());
            }
        });

        //code provided to ensure that contextMenu appears as part of the above actions
        listContextMenu.getItems().add(deleteStudent);
        listContextMenu.getItems().add(editStudent);

        //to ensure access to a particular cell in the studentListView
        studentListView.setCellFactory(new Callback<ListView<Student>, ListCell<Student>>() {
            public ListCell<Student> call(ListView<Student> param) {
                ListCell<Student> cell = new ListCell<Student>() {
                    @Override
                    protected void updateItem(Student stu, boolean empty) {
                        super.updateItem(stu, empty);

                        if (!empty) {
                            setText(stu.ToString());

                        } else {
                            setText("");

                        }
                    }//end of update()
                };
                //code included as part of the delete
                cell.emptyProperty().addListener(
                        (obs, wasEmpty, isNowEmpty) -> {
                            if (isNowEmpty) {
                                cell.setContextMenu(null);
                            } else {
                                cell.setContextMenu(listContextMenu);
                            }
                        });
                return cell;
            }
        }); //end of setting the cell factory


        Comparator<Student> YearOrder = new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {

                int YOS1 = Integer.valueOf(o1.GetYearOfStudy());
                int YOS2 = Integer.valueOf(o2.GetYearOfStudy());
                int yeardifference = YOS1 - YOS2;
                return yeardifference;

            }
        };

        SortedList<Student> sortedByYear = new SortedList<>(StudentData.getInstance().getStudents(), YearOrder);
        studentListView.getItems().setAll(sortedByYear);

        if (sortedByYear.size() != 0) {
            studentListView.getSelectionModel().select(sortedByYear.get(0));
        }


    }

    public void getChoice(ActionEvent event) {

        choice1 = mod1Choice.getValue();
        choice2 = mod2Choice.getValue();
        choice3 = mod3Choice.getValue();
    }


    @FXML
    public void addStudentData() {

        String StudentIds = studId.getText();
        String YearsStudied = yearStudy.getText();

        if ((StudentIds.replaceAll("\\s+", "").length() != 0) && (YearsStudied.replaceAll("\\s", "").length() != 0)) {
            try {
                Integer.valueOf(YearsStudied);
                validateStudent.setText("");
                studentToAdd = new Student(StudentIds, YearsStudied, choice1, choice2, choice3);
                StudentData.getInstance().addStudentData(studentToAdd);

                studentListView.getItems().add(studentToAdd);
                initialize();
                studentListView.getSelectionModel().select(studentToAdd);
                studentListView.refresh();

            } catch (Exception e) {
                validateStudent.setText("Error: cannot add student if studId or year of study not filled in");
            }
            ;
        } else {
            validateStudent.setText("Error: cannot add student if studId or year of study not filled in");


        }

    }

    public void deleteStudent(Student stu) {

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);

        alert.setTitle(("Delete a student from the list"));

        alert.setHeaderText(String.format("Deleting student " + stu.ToString()));
        //insert the line of code here

        alert.setContentText("Are you sure you want to delete the student?");

        Optional<ButtonType> result = alert.showAndWait();

        if (result.isPresent()) {
            if (result.get().getText().equals("OK")) {
                StudentData.getInstance().deleteStudent(stu);
                studentListView.getItems().remove(stu);
            }
        }
        ;

        //insert the 2 lines of code here

    }

    public void editStudent(Student stu) {
        //the dialog object has been completed for you
        Dialog<ButtonType> dialog = new Dialog<>();

        dialog.initOwner(mainWindow.getScene().getWindow());
        dialog.setTitle("Edit a student's details");
        dialog.setHeaderText(String.format("Editing student Id: %s", stu.ToString()));
        //insert the 3 lines of code here

        FXMLLoader fxmlLoader = new FXMLLoader();

        //insert the line of code here
        fxmlLoader.setLocation(Main.class.getResource("edit-students.fxml"));
        //remove the comments and complete the try...catch
        try {

            dialog.getDialogPane().setContent(fxmlLoader.load());
        } catch (IOException event) {
            System.out.print(event.toString());
            event.printStackTrace();
        }

        //}

        EditStudentController ec = fxmlLoader.getController();
        ec.setToEdit(stu);

        //insert the line of code here

        //insert the 2 lines of code here
        //the result object with the showAndWait() has been completed for you
        ButtonType Ok = new ButtonType("OK");
        ButtonType Cancel = new ButtonType("Cancel");
        dialog.getDialogPane().getButtonTypes().add(Ok);
        dialog.getDialogPane().getButtonTypes().add(Cancel);

        Optional<ButtonType> result = dialog.showAndWait();


        //remove the comments and complete the if...
        if (result.get().getText().equals("OK")) {
            Student editStudent = ec.processEdit(stu);
            studentListView.getItems().remove(stu);
            studentListView.getItems().add(editStudent);
            initialize();
            studentListView.getSelectionModel().select(editStudent);

            //select the edited studId here
        }

    }
}