import { useDark } from "@rspress/core/runtime";
import React from "react";

type DescriptionCardProps = {
    title: string;
    desc: string;
    icon?: string;
};

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ title, desc, icon }) => {
    const isDark = useDark();
    return (
        <div style={{
            position: 'relative',
            background: isDark ? 'none' : 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: isDark ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            justifyItems: 'center',
        }}>
            {icon && (
                <img src={icon} alt={title} style={{ width: 80, height: 80, marginBottom: 12 }} />
            )}
            <h3 style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: 500,
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.8
            }}>
                {desc}
            </p>
        </div>
    );
};
