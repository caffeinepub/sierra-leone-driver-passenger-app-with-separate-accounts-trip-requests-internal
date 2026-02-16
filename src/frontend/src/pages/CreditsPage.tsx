import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Award, Heart, Code, MapPin, User } from 'lucide-react';

export default function CreditsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Award className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl mb-2">Developer Credits</CardTitle>
            <CardDescription className="text-base">
              Meet the creator of SL GPS
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4 py-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Henry English
              </h2>
              <p className="text-xl font-semibold text-muted-foreground italic">
                A Sierra Leone Living Legend
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Sierra Leone</span>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Developer Story</h3>
                <p className="text-sm text-muted-foreground">
                  Henry English is the founder and technical manager of SL GPS. With a vision 
                  to revolutionize transportation in Sierra Leone, Henry believes in an Uber-style 
                  format that connects drivers and passengers seamlessly. His commitment to 
                  leveraging modern technology and blockchain innovation drives the platform's 
                  mission to provide accessible and reliable transportation solutions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Code className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">About This Application</h3>
                <p className="text-sm text-muted-foreground">
                  SL GPS is a transportation platform designed to connect drivers and passengers 
                  across Sierra Leone. Built with modern web technologies and powered by the 
                  Internet Computer blockchain for secure, decentralized authentication.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Heart className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Mission</h3>
                <p className="text-sm text-muted-foreground">
                  To provide accessible, reliable transportation solutions for the people of 
                  Sierra Leone, empowering both drivers and passengers with a platform that 
                  serves their needs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-accent/30 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Developed with dedication and passion for Sierra Leone
            </p>
            <p className="text-lg font-semibold mt-2">
              © {new Date().getFullYear()} Henry English
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
