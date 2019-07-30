import MakeExamination from '../views/test/makeExamination'
import TestExamination from '../views/test/testExamination'
import ExamManage from '../views/test/examManage'
import LookExamination from '../views/test/lookExamination'
import ReadExamination from '../views/test/readExamination'

export default [
    {
        path: '/makeExamination',
        components: {
            sidebar: MakeExamination
        }
    },
    {
        path: '/testExamination',
        components: {
            sidebar: TestExamination
        }
    },
    {
        path: '/examManage',
        components: {
            sidebar: ExamManage
        }
    },
    {
        path: '/lookExamination',
        components: {
            sidebar: LookExamination
        }
    },
    {
        path: '/readExamination',
        components: {
            sidebar: ReadExamination
        }
    }
]