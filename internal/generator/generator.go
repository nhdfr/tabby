package generator

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

var (
	firstNames = []string{
		"James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
		"William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
		"Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
		"Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
	}

	lastNames = []string{
		"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
		"Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
		"Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
		"Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
	}

	domains = []string{
		"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com",
		"test.com", "demo.com", "mail.com", "email.com", "inbox.com",
	}

	words = []string{
		"lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
		"sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
		"magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
	}

	sentences = []string{
		"This is a test message.",
		"Thank you for your assistance.",
		"Please review the attached document.",
		"Looking forward to your response.",
		"I hope this message finds you well.",
		"Could you please provide more information?",
		"I appreciate your help with this matter.",
		"Let me know if you need anything else.",
	}
)

type Generator struct {
	placeholderRegex *regexp.Regexp
}

func New() *Generator {
	return &Generator{
		placeholderRegex: regexp.MustCompile(`\{\{([^}]+)\}\}`),
	}
}

func (g *Generator) Generate(template string) (string, error) {
	result := g.placeholderRegex.ReplaceAllStringFunc(template, func(match string) string {
		placeholder := strings.Trim(match, "{}")
		placeholder = strings.TrimSpace(placeholder)

		parts := strings.Split(placeholder, ":")
		placeholderType := parts[0]

		value, err := g.generateValue(placeholderType, parts[1:])
		if err != nil {
			return match 
		}
		return value
	})

	return result, nil
}

func (g *Generator) generateValue(placeholderType string, params []string) (string, error) {
	switch placeholderType {
	case "name", "fullname":
		return g.randomName(), nil
	case "firstname":
		return g.randomFirstName(), nil
	case "lastname":
		return g.randomLastName(), nil
	case "email":
		return g.randomEmail(), nil
	case "phone", "mobile":
		return g.randomPhone(), nil
	case "number", "int":
		return g.randomNumber(params), nil
	case "text", "paragraph":
		return g.randomParagraph(), nil
	case "sentence":
		return g.randomSentence(), nil
	case "uuid":
		return uuid.New().String(), nil
	case "bool", "boolean":
		return g.randomBool(), nil
	case "date":
		return g.randomDate(), nil
	case "word":
		return g.randomWord(), nil
	default:
		return "", fmt.Errorf("unknown placeholder type: %s", placeholderType)
	}
}

func (g *Generator) randomName() string {
	return g.randomFirstName() + " " + g.randomLastName()
}

func (g *Generator) randomFirstName() string {
	return firstNames[g.secureRandomInt(len(firstNames))]
}

func (g *Generator) randomLastName() string {
	return lastNames[g.secureRandomInt(len(lastNames))]
}

func (g *Generator) randomEmail() string {
	username := strings.ToLower(g.randomFirstName() + g.randomLastName())
	domain := domains[g.secureRandomInt(len(domains))]
	return fmt.Sprintf("%s@%s", username, domain)
}

func (g *Generator) randomPhone() string {
	return fmt.Sprintf("+1-%03d-%03d-%04d",
		g.secureRandomInt(900)+100,
		g.secureRandomInt(900)+100,
		g.secureRandomInt(9000)+1000,
	)
}

func (g *Generator) randomNumber(params []string) string {
	min, max := 1, 100

	if len(params) >= 1 {
		if val, err := strconv.Atoi(params[0]); err == nil {
			min = val
		}
	}
	if len(params) >= 2 {
		if val, err := strconv.Atoi(params[1]); err == nil {
			max = val
		}
	}

	if max <= min {
		max = min + 1
	}

	return strconv.Itoa(g.secureRandomInt(max-min) + min)
}

func (g *Generator) randomParagraph() string {
	wordCount := g.secureRandomInt(20) + 30
	var result []string
	for range wordCount {
		result = append(result, words[g.secureRandomInt(len(words))])
	}
	text := strings.Join(result, " ")
	return strings.ToUpper(string(text[0])) + text[1:] + "."
}

func (g *Generator) randomSentence() string {
	return sentences[g.secureRandomInt(len(sentences))]
}

func (g *Generator) randomBool() string {
	if g.secureRandomInt(2) == 0 {
		return "false"
	}
	return "true"
}

func (g *Generator) randomDate() string {
	days := g.secureRandomInt(365)
	date := time.Now().AddDate(0, 0, -days)
	return date.Format("2006-01-02")
}

func (g *Generator) randomWord() string {
	return words[g.secureRandomInt(len(words))]
}

func (g *Generator) secureRandomInt(max int) int {
	if max <= 0 {
		return 0
	}
	n, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		return int(time.Now().UnixNano()) % max
	}
	return int(n.Int64())
}
