import { useNavigate } from "react-router-dom";
import "../styles/DashboardCard.css";

const DashboardCard = ({
    icon,
    title,
    value,
    description,
    link
}) => {

    const navigate = useNavigate();

    return (

        <div
            className="dashboard-card"
            onClick={() => link && navigate(link)}
            style={{ cursor: "pointer" }}
        >

            <div className="card-icon">{icon}</div>

            <h2>{value}</h2>

            <h3>{title}</h3>

            <p>{description}</p>

        </div>

    );

};

export default DashboardCard;