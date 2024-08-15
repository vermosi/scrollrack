'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Neo4JUser } from '@/types'
import * as React from 'react'
import TinderCard from 'react-tinder-card'

interface HomePageClientComponentProps {
    currentUser: Neo4JUser
    users: Neo4JUser[]
}

const HomePageClientComponent: React.FC<HomePageClientComponentProps> = ({currentUser,users}) => {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div>
            <h1 className="text-4xl">Hello {currentUser.firstName} {currentUser.lastName}</h1>
        </div>
        <div className="mt-4 relative">
            {users.map(user => (
                <TinderCard className="absolute" key={user.applicationId}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription>
                                {user.email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>

                </TinderCard>
            ))}
        </div>
    </div>;
};

export default HomePageClientComponent;