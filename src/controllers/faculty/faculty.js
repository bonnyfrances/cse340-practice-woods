import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

// Route handler for the faculty list page
const facultyListPage = (req, res) => {

    // Handle sorting if requested
    const sortBy = req.query.sort || 'department';
    console.log(sortBy);
    const faculty = getSortedFaculty(sortBy);
    

    // console.log(faculty);

    res.render('faculty/list', {
        title: 'Faculty List',
        faculty: { faculty },
        currentSort: sortBy
    });
};

// Route handler for the faculty detail page
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    console.log(facultyId)
    
    const facultyMember = getFacultyById(facultyId);
    console.log(facultyMember);

    // if faculty member does not exist
    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: 'Faculty Detail',
        facultyMember: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };