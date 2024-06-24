import dayjs from 'dayjs'
import 'dayjs/locale/es'
import objectSupport  from "dayjs/plugin/objectSupport"
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.locale('es')
dayjs.extend(objectSupport)
dayjs.extend(weekOfYear)

export default dayjs