package fsd.assignment.assignment1;

import fsd.assignment.assignment1.datamodel.Student;
import fsd.assignment.assignment1.datamodel.StudentData;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;

import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;


public class EditStudentController {
    //all of the variables declared below correspond with the edit-students.fxml
    @FXML
    private Label yearStudyDisplay;

    @FXML
    private Label mod1Edit;

    @FXML
    private Label mod2Edit;

    @FXML
    private Label mod3Edit;

    @FXML
    private ChoiceBox<String> mod1ChoiceEdit;

    @FXML
    private ChoiceBox<String> mod2ChoiceEdit;

    @FXML
    private ChoiceBox<String> mod3ChoiceEdit;

    //the modChoices variables correspond to the []
    private String mod1S, mod2S, mod3S;

    private String modChoices[] = {"OOP", "Data Algo", "DS", "Maths", "AI",
            "Adv Programming", "Project"};


    public void initialize() {

        /* TODO: add all the modChoices to each ChoiceBox
         */
        for (int i = 0; i <= 6; i++) {
            mod1ChoiceEdit.getItems().add(modChoices[i]);
            mod2ChoiceEdit.getItems().add(modChoices[i]);
            mod3ChoiceEdit.getItems().add(modChoices[i]);


        }
        ;
        //insert 3 lines of code here
        //these lines have been given to you includes the setOnAction if a ChoiceBox is selected
        mod1ChoiceEdit.setOnAction(this::getChoiceEdit);
        mod2ChoiceEdit.setOnAction(this::getChoiceEdit);
        mod3ChoiceEdit.setOnAction(this::getChoiceEdit);
    }

    //to ensure that detail pops up to edit
    public void setToEdit(Student stu) {
        /* TODO: display the student to be edited details
         */
        yearStudyDisplay.setText(stu.GetYearOfStudy());
        mod1Edit.setText(stu.GetModule1());
        mod2Edit.setText(stu.GetModule2());
        mod3Edit.setText(stu.GetModule3());

        mod1S = stu.GetModule1();
        mod2S = stu.GetModule2();
        mod3S = stu.GetModule3();

        //insert 4 lines of code here
        /* TODO: get the new module choices using mod1S, mod2S and mod3S
         */

    }

    public Student processEdit(Student stu) {
        /* TODO: complete the observableIst statement by getting all students from StudentData
                 to be collected in allStudents
         */
        ObservableList<Student> allStudents = StudentData.getInstance().getStudents();
        /* TODO: get studId and year of study
         */
        String studIdS = stu.ToString();
        String yearStudyS = stu.GetYearOfStudy();
        /* TODO: remove the student to be edited from allStudents
         */
        //insert the line to remove the student here
        allStudents.remove(stu);
        /* TODO: add the student back by creating a new object reference and calling the addStudentData()
         */
        Student changedStu = new Student(studIdS, yearStudyS, mod1S, mod2S, mod3S);
        //call the addStudentData()
        /* TODO: return the newly edited student back to the Controller class / editStudent()
         */
        StudentData.getInstance().addStudentData(changedStu);
        return changedStu;
    }

    public void getChoiceEdit(ActionEvent event) {
        if (event.getSource().equals(mod1ChoiceEdit)) {
            if (mod1ChoiceEdit.getValue() != null) {
                mod1S = mod1ChoiceEdit.getValue();

            }
        } else if (event.getSource().equals(mod2ChoiceEdit)) {
            if (mod2ChoiceEdit.getValue() != null) {
                mod2S = mod2ChoiceEdit.getValue();

            }
        } else if (event.getSource().equals(mod3ChoiceEdit)) {
            if (mod3ChoiceEdit.getValue() != null) {
                mod3S = mod3ChoiceEdit.getValue();

            }
        }
    }
}
