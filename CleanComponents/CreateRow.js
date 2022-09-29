import React from 'react';
import styles from './css/CreateRow.module.css';
import { MdOutlineCancel } from 'react-icons/md';

const CreateRow = ({ onCancel, user }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeading}>
                    <p className={styles.cardHeadingText}>
                        Create Table
                    </p>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ color: 'rgb(153,171,180)', borderRadius: '50%' }}
                        className="text-2xl p-3 hover:drop-shadow-xl 
                        hover:bg-light-gray "
                    >
                        <MdOutlineCancel />
                    </button>
                </div>


            </div>
        </div>
    );
}

export default CreateRow;