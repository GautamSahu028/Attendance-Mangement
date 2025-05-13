import { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Users,
  Book,
  FileText,
} from "lucide-react";

// Define types for the application
interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  schedule: string;
  students: number;
  description: string;
  syllabus: string | null;
  semester: string;
  courseType: "core" | "program" | "open";
}

interface FormData {
  courseName: string;
  courseCode: string;
  schedule: string;
  description: string;
  semester: string;
  courseType: "core" | "program" | "open";
}

interface TimePosition {
  start: number;
  end: number;
  startTime: string;
  endTime: string;
}

interface TimeSlot {
  label: string;
  fullTime: string;
  isHour: boolean;
}

export default function ClassManagement() {
  const [activeTab, setActiveTab] = useState<"courses" | "schedule">("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);
  const [showAddSyllabusModal, setShowAddSyllabusModal] =
    useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    courseName: "",
    courseCode: "",
    schedule: "",
    description: "",
    semester: "",
    courseType: "core",
  });

  // Mock data initialization
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        schedule: "Mon, Wed, Fri - 10:00 AM to 11:30 AM",
        students: 32,
        description:
          "Fundamental concepts of programming and computer science.",
        syllabus: "syllabus-cs101.pdf",
        semester: "Fall 2025",
        courseType: "core",
      },
      {
        id: 2,
        courseName: "Data Structures and Algorithms",
        courseCode: "CS201",
        schedule: "Tue, Thu - 1:00 PM to 3:00 PM",
        students: 28,
        description: "Advanced data structures and algorithm analysis.",
        syllabus: "syllabus-cs201.pdf",
        semester: "Fall 2025",
        courseType: "program",
      },
      {
        id: 3,
        courseName: "Database Systems",
        courseCode: "CS301",
        schedule: "Mon, Wed - 2:00 PM to 4:00 PM",
        students: 25,
        description: "Design and implementation of database systems.",
        syllabus: null,
        semester: "Spring 2026",
        courseType: "open",
      },
    ];
    setCourses(mockCourses);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    } as FormData);
  };

  const handleAddCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      schedule: formData.schedule,
      description: formData.description,
      students: 0,
      syllabus: null,
      semester: formData.semester,
      courseType: formData.courseType,
    };
    setCourses([...courses, newCourse]);
    setFormData({
      courseName: "",
      courseCode: "",
      schedule: "",
      description: "",
      semester: "",
      courseType: "core",
    });
    setShowAddCourseModal(false);
  };

  // Improved time position calculation function
  const getTimePosition = (timeString: string): TimePosition => {
    // Try to extract time like "10:00 AM" from strings like "Mon, Wed - 10:00 AM to 11:30 AM"
    const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch)
      return { start: 0, end: 2, startTime: "9:00 AM", endTime: "10:00 AM" }; // Default position if parsing fails

    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();

    // Convert to 24-hour format
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    // Look for end time
    const endTimeMatch = timeString.match(/to\s*(\d+):(\d+)\s*(AM|PM)/i);
    let endHour = hour + 1; // Default to 1 hour duration
    let endMinute = 0;

    if (endTimeMatch) {
      let endTime = parseInt(endTimeMatch[1]);
      endMinute = parseInt(endTimeMatch[2]);
      const endAmPm = endTimeMatch[3].toUpperCase();

      if (endAmPm === "PM" && endTime < 12) endTime += 12;
      if (endAmPm === "AM" && endTime === 12) endTime = 0;

      endHour = endTime;
    }

    // Calculate position based on 9 AM (9:00) start time
    // Each hour has 6 slots (10 minutes each)
    const startOffset = (hour - 9) * 6 + Math.floor(minute / 10);
    const endOffset = (endHour - 9) * 6 + Math.ceil(endMinute / 10);

    return {
      start: startOffset,
      end: endOffset,
      startTime: `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${
        hour >= 12 ? "PM" : "AM"
      }`,
      endTime: `${endHour % 12 || 12}:${endMinute
        .toString()
        .padStart(2, "0")} ${endHour >= 12 ? "PM" : "AM"}`,
    };
  };

  const handleDeleteCourse = (courseId: number): void => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const handleUploadSyllabus = (): void => {
    // Mock syllabus upload functionality
    if (!selectedCourse) return;

    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          syllabus: `syllabus-${course.courseCode.toLowerCase()}.pdf`,
        };
      }
      return course;
    });
    setCourses(updatedCourses);
    setShowAddSyllabusModal(false);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate time slots from 9 AM to 5 PM with 10-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        if (hour === 17 && minute > 0) continue; // Stop at 5:00 PM

        const formattedHour = hour % 12 || 12;
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedMinute = minute.toString().padStart(2, "0");

        slots.push({
          label:
            minute === 0 ? `${formattedHour}:${formattedMinute} ${ampm}` : "",
          fullTime: `${formattedHour}:${formattedMinute} ${ampm}`,
          isHour: minute === 0,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Class/Course Management
        </h1>
        <p className="text-gray-600">
          Manage your courses, syllabi, and student rosters
        </p>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "courses"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "schedule"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule
          </button>
        </div>
      </div>

      {activeTab === "courses" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => setShowAddCourseModal(true)}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Syllabus
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{course.courseName}</td>
                    <td className="px-6 py-4">{course.courseCode}</td>
                    <td className="px-6 py-4">{course.semester}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          course.courseType === "core"
                            ? "bg-blue-100 text-blue-800"
                            : course.courseType === "program"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.courseType.charAt(0).toUpperCase() +
                          course.courseType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{course.students}</td>
                    <td className="px-6 py-4">
                      {course.syllabus ? (
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {course.syllabus}
                        </span>
                      ) : (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowAddSyllabusModal(true);
                          }}
                        >
                          Upload Syllabus
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-gray-600 hover:text-blue-600"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowRosterModal(true);
                          }}
                        >
                          <Users className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "schedule" && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-medium">
              Weekly Schedule (9:00 AM - 5:00 PM)
            </h2>
          </div>

          {/* Improved Schedule Graph with Grid */}
          <div className="relative overflow-x-auto bg-white rounded-lg shadow border">
            {/* Time header - X axis */}
            <div className="flex border-b">
              <div className="w-24 p-2 font-medium text-gray-700 border-r bg-gray-50">
                Day
              </div>
              <div className="flex flex-grow">
                {timeSlots.map((slot, i) => (
                  <div
                    key={`time-${i}`}
                    className={`flex-shrink-0 w-8 p-1 text-center text-xs font-medium text-gray-700 ${
                      slot.isHour ? "border-l" : ""
                    }`}
                    style={{
                      borderLeft: slot.isHour ? "1px solid #e5e7eb" : "none",
                    }}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Days and schedule items - Y axis */}
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day, dayIndex) => {
                // Filter courses for this day
                const dayCourses = courses.filter((course) =>
                  course.schedule
                    .toLowerCase()
                    .includes(day.substring(0, 3).toLowerCase())
                );

                return (
                  <div key={day} className="flex border-b hover:bg-gray-50">
                    <div className="w-24 p-3 font-medium border-r bg-gray-50">
                      {day}
                    </div>
                    <div
                      className="flex-grow relative"
                      style={{ height: "80px" }}
                    >
                      {/* Grid lines for 10-minute intervals */}
                      <div
                        className="absolute inset-0 grid grid-cols-48"
                        style={{ pointerEvents: "none" }}
                      >
                        {timeSlots.map((slot, i) => (
                          <div
                            key={`grid-${i}`}
                            className={`h-full ${
                              slot.isHour
                                ? "border-l border-gray-300"
                                : "border-l border-gray-100"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Course blocks */}
                      {dayCourses.map((course) => {
                        // Parse course schedule to position it correctly
                        const timeInfo = getTimePosition(course.schedule);

                        return (
                          <div
                            key={`${day}-${course.id}`}
                            className="absolute h-16 px-2 py-1 rounded-md border-l-4 border-blue-500 shadow-sm bg-blue-50 flex flex-col justify-center overflow-hidden"
                            style={{
                              left: `${timeInfo.start * 8}px`,
                              width: `${(timeInfo.end - timeInfo.start) * 8}px`,
                              top: "8px",
                              zIndex: 10,
                            }}
                            title={`${course.courseCode}: ${timeInfo.startTime} - ${timeInfo.endTime}`}
                          >
                            <div className="font-medium text-sm truncate">
                              {course.courseCode}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {course.courseName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Time ranges legend */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Time is displayed in 10-minute increments from 9:00 AM to 5:00 PM
            </p>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Schedule
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Mon, Wed, Fri - 10:00 AM to 11:30 AM"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Fall 2025"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Type
              </label>
              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="core">Core</option>
                <option value="program">Program</option>
                <option value="open">Open</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                onClick={() => setShowAddCourseModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleAddCourse}
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Syllabus Modal */}
      {showAddSyllabusModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Syllabus</h2>
            <p className="mb-4 text-gray-600">
              Upload syllabus for:{" "}
              <span className="font-medium">{selectedCourse.courseName}</span>
            </p>
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop a PDF file here, or click to select a file
              </p>
              <input type="file" className="hidden" />
              <button className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Select File
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                onClick={() => setShowAddSyllabusModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleUploadSyllabus}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Roster Modal */}
      {showRosterModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Class Roster: {selectedCourse.courseName}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowRosterModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <Book className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-gray-700">
                  {selectedCourse.courseCode}
                </span>
              </div>
              <button className="flex items-center px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Student
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Attendance
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.students > 0 ? (
                    Array(Math.min(selectedCourse.students, 5))
                      .fill(null)
                      .map((_, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            S{(1000 + idx).toString()}
                          </td>
                          <td className="px-4 py-2">Student Name {idx + 1}</td>
                          <td className="px-4 py-2">
                            student{idx + 1}@university.edu
                          </td>
                          <td className="px-4 py-2">
                            {Math.floor(Math.random() * 40) + 60}%
                          </td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No students enrolled in this course yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                onClick={() => setShowRosterModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
