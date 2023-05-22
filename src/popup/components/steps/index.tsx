import styles from "./index.less";

interface StepProps {
    current: number,
    steps?: Record<string, any>[]
}

const FinishDot = () => {
    return (
        <div className={styles.finishDot}>
            <p/>
        </div>
    )
}

const WaitDot = () => {
    return (
        <div className={styles.dot}/>
    )
}

const Steps = ({current, steps = [{}, {}, {}]}: StepProps) => {

    return (
        <div className={styles.steps}>

            <FinishDot/>
            <div className={styles.line} style={{background: current > 1 ? '#e75353' : 'white'}}/>
            {
                steps?.map((step: Record<string, any>, index: number) => {
                    if (index === 0 || index === steps?.length - 1) return <></>

                    return <div key={index} className={styles.dots}>
                        {current - 1 >= index ? <FinishDot/> : <WaitDot/>}
                        <div className={styles.line}
                             style={{background: current - 1 > index ? '#e75353' : 'white'}}/>
                    </div>
                })
            }
            {current === steps.length ? <FinishDot/> : <WaitDot/>}
        </div>
    )
}
export default Steps
