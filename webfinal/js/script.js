// Global variables for storing data.
const lectures = [];
let students = [];
let rIndex; /* To hold to chosen row index. */
let deleteStudentInfo = []; /* deleteStudentInfo[0] -> student.id deleteStudentInfo[1] -> lectureName*/

class Lecture {
  constructor(id, name, pointScale) {
    this.id = Number(id);
    this.name = name;
    this.midterm = 0;
    this.final = 0;
    this.pointScale = Number(pointScale);
    this.numberOfPassed = 0;
    this.numberOfFailed = 0;
    this.numberOfStudents = 0;
    this.letterScoreBaseTen = this.letterScoreBaseTen.bind(this);
    this.letterScoreBaseSeven = this.letterScoreBaseSeven.bind(this);
    this.calScore = this.calScore.bind(this);
    this.score =this.calScore();
    this.letterScoreTen = this.letterScoreBaseTen();
    this.letterScoreSeven = this.letterScoreBaseSeven();
  }

  calScore(){
    return (this.midterm * 0.4 + this.final * 0.6);
  }

  letterScoreBaseTen() {
    const score = this.calScore();
    if (90 <= score) {
      return "A";
    } else if (80 <= score && score < 90) {
      return "B";
    } else if (70 <= score && score < 80) {
      return "C";
    } else if (60 <= score && score < 70) {
      return "D";
    } else {
      return "F";
    }
  }

  letterScoreBaseSeven() {
    const score = this.calScore();
    if (93 <= score) {
      return "A";
    } else if (85 <= score && score < 93) {
      return "B";
    } else if (77 <= score && score < 85) {
      return "C";
    } else if (70 <= score && score < 77) {
      return "D";
    } else {
      return "F";
    }
  }
}
class Student {
  constructor(id, name, lastName,scores) {
    this.id = Number(id);
    this.name = name;
    this.lastName = lastName;
    this.lectures = [];
    this.getScores = this.getScores.bind(this);
    this.calGpa = this.calGpa.bind(this);
    this.gpa = this.calGpa();
    this.scores = this.getScores();
    this.getFullName = this.getFullName.bind(this);
    this.fullName = this.getFullName();
  };

  getFullName(){
    return this.name + " " + this.lastName;
  }
  /*Returns an array that consists student's scores information. */
  getScores(){
    const scores = [];
    if(this.lectures.length === 0){
      return 0;
    }else {
      for(const lecture of this.lectures){
        scores.push(new Object({
          lectureName: lecture.name,
          midterm: lecture.midterm,
          final:lecture.final,
          score:lecture.calScore,
          letterScoreSeven: lecture.letterScoreBaseSeven(),
          letterScoreTen: lecture.letterScoreBaseTen(),
          resultBaseTen: "",
          resultBaseSeven:"",
        }));
      }
      return scores;
    }
  };

  calGpa() {
    let totalScore = 0;
    let gpa = 0;
    if(this.lectures.length === 0){
      return gpa;
    }else{
      for(const lecture of this.lectures){
        totalScore += Number(lecture.calScore());
      }
      return (totalScore / this.lectures.length);
    }
  }
}

// If entrying student is exist,it will return the student otherwise false.
function checkStudent(id) {
  if (students.length !== 0) {
    for (const student of students) {
      if (student.id === id) {
        return student;
      }
    }
    return false;
  } else {
    return false;
  }
}
/* Adds the students according to taken input from user and checks the conditions of inputs for providing data consistency. */
function addStudent() {
  const id = Number(document.querySelector("#studentId").value);
  const name = document.querySelector("#name").value;
  const lastName = document.querySelector("#lastName").value;
  const midterm = Number(document.querySelector("#midterm").value);
  const final = Number(document.querySelector("#final").value);
  let selectedLecture = handleSelectChange(selectLectureElmnt);
  if (selectedLecture === undefined || null) {
    alert("Choose a lecture!");
    return;
  }
  if (name === "" || lastName === "" || midterm === "" || final === "") {
    alert("You need to fill all the fields!");
    return;
  }
  let chosenLecture;
  for(let lecture of lectures ){
    if(lecture.name ===  selectedLecture){
      lecture.numberOfStudents++;
      chosenLecture = new Lecture(lecture.id,lecture.name,lecture.pointScale);
    }
  }
  
  chosenLecture.midterm = midterm;
  chosenLecture.final = final;
  if (midterm >= 0 && midterm <= 100 && final >= 0 && final <= 100 && id > 0) {
    if (!checkStudent(id)) {
      const student = new Student(id, name, lastName, midterm, final);
      student.lectures.push(chosenLecture);
      students.push(student);
    } else {
      const currentStudent = checkStudent(id);
      for (let lecture of currentStudent.lectures) {
        if (lecture.id === chosenLecture.id) {
          alert("You cannot add same lecture twice!");
          return;
        }
      }
      currentStudent.lectures.push(chosenLecture);
    }
  } else {
    alert("Grades must be valid values[0-100] and id must be greater than 0");
    return;
  }
}
// If entrying lecture is exist,it will return true otherwise false.
function checkLecture(lectureId) {
  if (lectures.length !== 0) {
    for (const lecture of lectures) {
      if (lecture.id === lectureId) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}
/* Adds the lectures according to taken input from user and checks the conditions of inputs for providing data consistency.*/
function addLecture() {
  const lectureDetails = document.querySelector("#lectureDetails");
  const lectureResults = document.querySelector("#lectureResults");
  const containerElement = document.querySelector("#selectLecture");
  const lectureId = Number(document.querySelector("#lectureId").value);
  const lectureName = document.querySelector("#lectureName").value;
  let getSelectedValue = document.querySelector(
    'input[name="pointScale"]:checked'
  );
  if (getSelectedValue === null) {
    alert("Choose a PointScale");
    return;
  }
  if (lectureId > 0 && !checkLecture(lectureId) && lectureName !== "") {
    if (Number(getSelectedValue.value) === 10) {
      lectures.push(new Lecture(lectureId, lectureName, 10));
      displayLecture(lectureId, lectureName, containerElement);
      displayLecture(lectureId, lectureName, lectureResults);
      displayLecture(lectureId, lectureName, lectureDetails);
    } else if (Number(getSelectedValue.value) === 7) {
      lectures.push(new Lecture(lectureId, lectureName, 7));
      displayLecture(lectureId, lectureName, containerElement);
      displayLecture(lectureId, lectureName, lectureResults);
      displayLecture(lectureId, lectureName, lectureDetails);
    }
  } else {
    alert(
      "Lecture ID cannot less and equal than 0(includes empty fields) or you added the lecture before!"
    );
  }
}
// Adds a option to the select element for dropdown menu.
function displayLecture(lectureId, lectureName, containerElement) {
  let option = document.createElement("OPTION");
  option.innerHTML = lectureName;
  option.value = lectureName;
  containerElement.appendChild(option);
}
// Returns the selected option from select element.
function handleSelectChange(element) {
  let selectedIndex = element.selectedIndex;
  let selectedOption = element.options[selectedIndex];
  return selectedOption === undefined ? undefined : selectedOption.value;
}

// It will return score object of entrying lecture.
function getScoreObjectOfStudent(id,lectureName){
  for(const student of students){
    if(student.id === id){
      for(const scoreObject of student.getScores()){
        if(scoreObject.lectureName === lectureName){
          return scoreObject;
        }
      }
    }
  }
}
/*It will return a array that contains spesific students. */
function filterStudents(arr, lectureName, isPassed, pointScale) {
  const filteredStudents = [];
  for(const student of arr){
    if(student.lectures.length === 0){
      continue;
    }
    for(const scoreObject of student.getScores()){
      if(scoreObject.lectureName === lectureName){
        if(isPassed === "passed" && Number(pointScale) === 10){
          if(scoreObject.letterScoreTen !== "F"){
            scoreObject["resultBaseTen"]= "passed";
            filteredStudents.push(student);
          }
        }
        else if(isPassed === "failed" && Number(pointScale) === 10){
          if(scoreObject.letterScoreTen === "F"){
            scoreObject["resultBaseTen"]= "failed";
            filteredStudents.push(student);
          }
        }
        else if(isPassed === "passed" && Number(pointScale) === 7){
          if(scoreObject.letterScoreSeven !== "F"){
            scoreObject["resultBaseSeven"]= "passed";
            filteredStudents.push(student);
          }
        }
        else if(isPassed === "failed" && Number(pointScale) === 7){
          if(scoreObject.letterScoreSeven === "F"){
            scoreObject["resultBaseSeven"]= "failed";
            filteredStudents.push(student);
          }
        }else if(isPassed ==="allStudents" && Number(pointScale) === 10){
          if(scoreObject.letterScoreTen !== "F"){
            scoreObject["resultBaseTen"]= "passed";
            filteredStudents.push(student);
          }else{
            scoreObject["resultBaseTen"]= "failed";
            filteredStudents.push(student);
          }
          
        }else if(isPassed ==="allStudents" && Number(pointScale) === 7){
          if(scoreObject.letterScoreSeven !== "F"){
            scoreObject["resultBaseSeven"]= "passed";
            filteredStudents.push(student);
          }else if(scoreObject.letterScoreSeven === "F"){
            scoreObject["resultBaseSeven"]= "failed";
            filteredStudents.push(student);
          }
        }
      }
    }
  }
  return filteredStudents;
}
/*It will display a table that shows all the students according to selected options.*/
function studentsInLectureTable() {
  const tableData = document.querySelector("#studentData");
  tableData.innerHTML = "";
  let isPassed = document.querySelector('input[name="studentResult"]:checked');
  let selectedLecture = handleSelectChange(lectureResults);
  if (selectedLecture === undefined || null) {
    alert("Choose a lecture!");
    return;
  }
  let scaleResult = document.querySelector(
    'input[name="pointScaleResult"]:checked'
  );
  if (isPassed === null || scaleResult === null) {
    alert("Do not leave any empty field!");
    return;
  }

  let filteredStudents = filterStudents(
    students,
    selectedLecture,
    isPassed.value,
    Number(scaleResult.value),
  );
  for (let i = 0; i < filteredStudents.length; i++) {
    if(filteredStudents.length === 0){
      tableData.innerHTML += "<h2>No Results Found</h2>";
    }
    if(filteredStudents[i].lectures.lenght === 0 ){
      continue;
    }
    let scoreObject = getScoreObjectOfStudent(filteredStudents[i].id,selectedLecture);
    let row = `<tr>
            <td>${filteredStudents[i].id}</td>
            <td>${filteredStudents[i].name}</td>
            <td>${filteredStudents[i].lastName}</td>
            <td>${filteredStudents[i].getFullName() }</td>
            <td>${scoreObject.midterm}</td>
            <td>${scoreObject.final}</td>
            <td>${scoreObject.score()}</td>
            <td>${
              Number(scaleResult.value) === 10
                ? scoreObject.letterScoreTen
                : scoreObject.letterScoreSeven
            }</td>
            <td>${selectedLecture}</td>
            <td>${filteredStudents[i].calGpa()}</td>
            <td><button type="button" value="Update" onclick="selectedRowToInput()">Update</td>
            <td><button type="button" value="Delete" onclick="deleteStudentFromLecture()">Delete</td>
            </tr>`;
    tableData.innerHTML += row;
  }
}

/*It displays a table that consist all of the students when you click the button*/
function showStudents(){
  const studentData = document.querySelector("#studentData");
  studentData.innerHTML = "";
  for(const student of students){
    if(student.lectures.length === 0){
      continue;
    }
    for(const scoreObject of student.getScores()){
      let row = `<tr>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.lastName}</td>
      <td>${student.getFullName()}</td>
      <td>${scoreObject.midterm}</td>
      <td>${scoreObject.final}</td>
      <td>${scoreObject.score()}</td>
      <td>${scoreObject.letterScoreTen}</td>
      <td>${scoreObject.lectureName}</td>
      <td>${student.calGpa()}</td>
      <td><button type="button" value="Update" onclick="selectedRowToInput()">Update</td>
      <td><button type="button" value="Delete" onclick="deleteStudentFromLecture()">Delete</td>
      </tr>`;
      studentData.innerHTML += row;
    }
  }
}

/*It takes lecture info array as a argument and it returns a StudentDatas object.*/
function studentsAnalytics(passedStudentsArr, failedStudentsArr,selectedLecture) {
  let midtermSum = 0;
  let finalSum = 0;
  if (passedStudentsArr.length !== 0) {
    for (const student of passedStudentsArr) {
      let scoreObject = getScoreObjectOfStudent(student.id,selectedLecture);
      midtermSum += Number(scoreObject.midterm);
      finalSum += Number(scoreObject.final);
    }
  }
  if (failedStudentsArr.length !== 0) {
    for (const student of failedStudentsArr) {
      let scoreObject = getScoreObjectOfStudent(student.id,selectedLecture);
      midtermSum += Number(scoreObject.midterm);
      finalSum += Number(scoreObject.final);
    }
  }
  let numberOfStudents = passedStudentsArr.length + failedStudentsArr.length;
  let midtermMean = (midtermSum / numberOfStudents);
  let finalMean = (finalSum / numberOfStudents);
  let scoreMean = ((midtermSum * 0.4 + finalSum * 0.6) /(numberOfStudents));
  const studentDatas = {
    midtermAvg: midtermMean,
    finalAvg: finalMean,
    scoreAvg: scoreMean,
    passed: passedStudentsArr.length,
    failed: failedStudentsArr.length,
    totalStudents: numberOfStudents,
  };
  return studentDatas;
}
/* It will return an array that contains lecture information about selected lecture to display on the LECTURE TABLE
lectureInfo[0] -> LectureObject
lectureInfo[1] -> Passed Students that take the selected lecture.
lectureInfo[2] -> Failed students that take the selected lecture.
*/
function lectureInfo(lectureName, scaleLectureResult) {
  const lectureInfo = [];
  let selectedLecture;
  for (const lecture of lectures) {
    if (lecture.name === lectureName) {
      selectedLecture = lecture;
    }
  }
  const passedStudents = filterStudents(
    students,
    selectedLecture.name,
    "passed",
    scaleLectureResult.value
  );

  const failedStudents = filterStudents(
    students,
    selectedLecture.name,
    "failed",
    scaleLectureResult.value
  );
  lectureInfo.push(selectedLecture);
  lectureInfo.push(passedStudents);
  lectureInfo.push(failedStudents);
  return lectureInfo;
}

/* The function that will display details of the lecture */
function lectureDetailsTable() {
  const lectureData = document.querySelector("#lectureData");
  lectureData.innerHTML = "";
  let scaleLectureResult = document.querySelector(
    'input[name="scaleLectureResult"]:checked'
  );
  let selectedLecture = handleSelectChange(lectureDetails);
  if (selectedLecture === undefined || null) {
    alert("Choose a lecture!");
    return;
  }
  if (scaleLectureResult === null) {
    alert("Do not leave any empty field!");
    return;
  }
  let lectureInfoArr = lectureInfo(selectedLecture, scaleLectureResult);

  let studentDataObject = studentsAnalytics(
    lectureInfoArr[1],
    lectureInfoArr[2],
    selectedLecture,
  );
  let row = `<tr>
            <td>${selectedLecture}</td>
            <td>${studentDataObject.midtermAvg}</td>
            <td>${studentDataObject.finalAvg}</td>
            <td>${studentDataObject.scoreAvg}</td>
            <td>${studentDataObject["passed"]}</td>
            <td>${studentDataObject["failed"]}</td>
            <td>${studentDataObject.totalStudents}</td>

          </tr>`;
  lectureData.innerHTML += row;
}


/* Deletes the student from selected lecture. */
function deleteStudentFromLecture(){
  temp = [];
  const studentTable = document.querySelector("#studentTable");
  for(let i = 1; i < studentTable.rows.length; i++){
    // Getting selected row index
    studentTable.rows[i].onclick = function(){
          rIndex = this.rowIndex;
          let id = this.cells[0].innerHTML;
          let lectureName = this.cells[8].innerHTML;
          for(const student of students){
            if(student.id ===  Number(id)){
              for(const lecture of student.lectures){
                if(lectureName === lecture.name){
                  console.log(lecture);
                }else{
                  temp.push(lecture);
                }
              }
            student.lectures = temp;
            }
          }


        };
  }
  // event.target will be the input element.
  let td = event.target.parentNode; 
  let tr = td.parentNode; // the row to be removed
  tr.parentNode.removeChild(tr);
  deleteStudentInfo = [];
}

function selectedRowToInput(){
  const studentTable = document.querySelector("#studentTable");
  for(let i = 1; i < studentTable.rows.length; i++){
    // Getting selected row index
    studentTable.rows[i].onclick = function(){
          rIndex = this.rowIndex;
          document.querySelector("#studentId").value = this.cells[0].innerHTML;
          document.querySelector("#name").value = this.cells[1].innerHTML;
          document.querySelector("#lastName").value = this.cells[2].innerHTML;
          document.querySelector("#midterm").value = this.cells[4].innerHTML;
          document.querySelector("#final").value = this.cells[5].innerHTML;
          document.querySelector("#selectLecture").value = this.cells[8].innerHTML;
          let id = Number(document.querySelector("#studentId").value);
          let lectureName = document.querySelector("#selectLecture").value;
          console.log(deleteStudentInfo);
          deleteStudentInfo = [id,lectureName];

        };
  }

  
}

/* 
A function that updates table and student's that want to be updated dependencies.
It renders new results. */
function updateStudent()
{
    const temp = [];
    const studentTable = document.querySelector("#studentTable");
    let studentId = document.querySelector("#studentId").value;
    studentTable.rows[rIndex].cells[1].innerHTML = document.querySelector("#name").value;
    studentTable.rows[rIndex].cells[2].innerHTML = document.querySelector("#lastName").value;
    studentTable.rows[rIndex].cells[4].innerHTML = document.querySelector("#midterm").value;
    studentTable.rows[rIndex].cells[5].innerHTML = document.querySelector("#final").value;
    studentTable.rows[rIndex].cells[8].innerHTML = document.querySelector("#selectLecture").value;
    for(const student of students){
      if(Number(studentId) === student.id){
        for(const lecture of student.lectures){{
          if(document.querySelector("#selectLecture").value === lecture.name){
            student.name = document.querySelector("#name").value;
            student.lastName = document.querySelector("#lastName").value;
            student.fullName = student.getFullName();
            lecture.midterm = Number(document.querySelector("#midterm").value);
            lecture.final = Number(document.querySelector("#final").value);
            lecture.score = lecture.calScore();
            student.fullName = student.getFullName();
            studentTable.rows[rIndex].cells[6].innerHTML = lecture.score;
            studentTable.rows[rIndex].cells[3].innerHTML = student.fullName;
            studentTable.rows[rIndex].cells[7].innerHTML = lecture.pointScale === 10 ? lecture.letterScoreBaseTen():lecture.letterScoreBaseSeven();
            studentTable.rows[rIndex].cells[9].innerHTML = student.calGpa();
            temp.push(student);
          }
        }
      }
    }else{
      temp.push(student);
    }
  }
  students = temp;
}
function searchStudent() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.querySelector("#searchStudent");
  filter = input.value.toUpperCase();
  table = document.querySelector("#studentTable");
  tr = table.querySelectorAll("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].querySelectorAll("td")[3];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
const btnLectureResults = document.querySelector("#btnLectureResults");
const selectLectureElmnt = document.querySelector("#selectLecture");
const btnAddLecture = document.querySelector("#addLecture");
const btnAddStudent = document.querySelector("#addStudent");
const lectureResults = document.querySelector("#lectureResults");
const lectureDetails = document.querySelector("#lectureDetails");
const btnLectureDetails = document.querySelector("#btnLectureDetails");
const studentTable = document.querySelector("#studentTable");
const btnUpdateStudent = document.querySelector("#btnUpdateStudent");
const btnShowStudents = document.querySelector("#btnShowStudents");
const inputSearchStudent = document.querySelector("#searchStudent");
btnUpdateStudent.addEventListener("click",updateStudent);
btnAddStudent.addEventListener("click", addStudent);
btnAddLecture.addEventListener("click", addLecture);
btnLectureResults.addEventListener("click", studentsInLectureTable);
btnLectureDetails.addEventListener("click", lectureDetailsTable);
btnShowStudents.addEventListener('click',showStudents);
inputSearchStudent.addEventListener("keyup",searchStudent);