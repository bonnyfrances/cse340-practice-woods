import { getFacultyBySlug, getSortedFaculty } from "../../models/faculty/faculty.js";

// Route handler for the faculty list page
const facultyListPage = async (req, res) => {
    // Handle sorting if requested
    const sortBy = req.query.sort || 'department';

    const facultyMembers = await getSortedFaculty(sortBy);
    
    res.render('faculty/list', {
        title: 'Faculty List',
        faculty: facultyMembers,
        currentSort: sortBy
    });
};

// Route handler for the faculty detail page
const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    console.log(facultySlug)
    
    const facultyMember = await getFacultyBySlug(facultySlug);
    console.log(facultyMember);

    // if faculty member does not exist
    if (!Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: 'Faculty Detail',
        facultyMember: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };